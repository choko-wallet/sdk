// Copyright 2021-2022 @choko-wallet/core authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Keyring, { encodeAddress } from '@polkadot/keyring';
import { cryptoWaitReady, ethereumEncode, mnemonicToMiniSecret, mnemonicValidate } from '@polkadot/util-crypto';
import { SymmetricEncryption } from '@skyekiwi/crypto';

import { CURRENT_VERSION, KeypairType, Version } from './types';
import * as Util from './util';
import { IDappDescriptor } from '.';

export interface IAccountOption {
  keyType: KeypairType;
  localKeyEncryptionStrategy: number; // 1='password-v0' | 2='webauthn';
  hasEncryptedPrivateKeyExported: boolean;
  // whether the user had exported the private key to email
  // set to be true when
  //      1. the account is imported from unencrypted private key link
  //      2. the account has click the link to export private key via link to email

  version?: Version;
}

export class AccountOption implements IAccountOption {
  keyType: KeypairType;
  localKeyEncryptionStrategy: number;
  hasEncryptedPrivateKeyExported: boolean;
  version?: Version;

  constructor (option: IAccountOption) {
    this.keyType = option.keyType;
    this.localKeyEncryptionStrategy = option.localKeyEncryptionStrategy;
    this.hasEncryptedPrivateKeyExported = option.hasEncryptedPrivateKeyExported;
    this.version = option.version ? option.version : CURRENT_VERSION;
  }

  /**
   * validate if the AccountOption is valid
   * @returns {boolean} the validity of the AccountOption
  */
  public validate (): boolean {
    return this.keyType && (this.localKeyEncryptionStrategy > 0 || this.localKeyEncryptionStrategy < 2);
  }

  /**
    * get the length of serializedLength
    * @returns {number} size of the serializedLength
  */
  public static serializedLength (): number {
    return 1 + // keyType
      1 + // localKeyEncryptionStrategy
      1 + // hasEncryptedPrivateKeyExported
      1; // version
  }

  /**
   * serialize AccountOption
   * @returns {Uint8Array} serialized AccountOption
 */
  public serialize (): Uint8Array {
    const res = new Uint8Array(AccountOption.serializedLength());

    res.set([Util.keypairTypeStringToNumber(this.keyType)], 0);
    res.set([this.localKeyEncryptionStrategy], 1);
    res.set([this.hasEncryptedPrivateKeyExported ? 1 : 0], 2);
    res.set([this.version], 3);

    return res;
  }

  /**
    * deserialize AccountOption
    * @param {Uint8Array} data serialized AccountOption
    * @returns {AccountOption} AccountOption Object
  */
  public static deserialize (data: Uint8Array): AccountOption {
    if (data.length !== AccountOption.serializedLength()) {
      throw new Error('invalid data length - AccountOption.deserialize');
    }

    const keyType = Util.keypairTypeNumberToString(data[0]);
    const localKeyEncryptionStrategy = data[1];
    const hasEncryptedPrivateKeyExported = data[2] === 1;
    const version = data[3];

    return new AccountOption({
      hasEncryptedPrivateKeyExported: hasEncryptedPrivateKeyExported,

      keyType: keyType,

      localKeyEncryptionStrategy: localKeyEncryptionStrategy,

      version: version
    });
  }
}

export interface AccountBalance {
  freeBalance: string;
  lockedBalance: string;
}

export interface IUserAccountInfo extends IUserAccount {
  // derived fields
  balance?: AccountBalance;
  connectedDapps?: IDappDescriptor[];
  // ....

  version: Version,
}

export interface IUserAccount {
  // CORE FIELDS
  privateKey?: Uint8Array;
  option: AccountOption;

  // DERIVED
  isLocked: boolean;
  address: string;
  publicKey: Uint8Array; // len == 32 for curve25519 family | len == 33 for secp256k1

  serialize(): Uint8Array;
}

export class UserAccount implements IUserAccount {
  privateKey?: Uint8Array;
  encryptedPrivateKey?: Uint8Array; // len = 72

  option: AccountOption;

  isLocked: boolean;
  address: string;
  publicKey: Uint8Array; // len == 32 for curve25519 family | len == 33 for secp256k1

  constructor (option: AccountOption) {
    if (!option.validate()) {
      throw new Error('invalide option - UserAccount.constructor');
    }

    this.option = option;
    this.isLocked = true;
  }

  /**
  * remove privateKey from account and lock the account
  */
  public lock (): void {
    delete this.privateKey;
    this.isLocked = true;
  }

  /**
  * unlock account
  * @param {Uint8Array} privateKey a 32 bytes secretKey
  */
  public unlock (privateKey: Uint8Array): void {
    if (privateKey.length !== 32) {
      throw new Error('invalid private key length - UserAccount.unlock');
    }

    this.privateKey = privateKey;
    this.isLocked = false;
  }

  /**
    * initialize user account. Generate the publicKey and address for the account
    * @returns {Promise<void>} None.
  */
  public async init (): Promise<void> {
    if (this.isLocked) {
      throw new Error('account is locked - UserAccount.init');
    }

    await cryptoWaitReady();

    const kr = (new Keyring({
      type: this.option.keyType
    })).addFromSeed(this.privateKey);

    this.address = kr.address;
    this.publicKey = kr.publicKey;
  }

  /**
    * use privateKey to generate account
    * @param {Uint8Array} privateKey a 32 bytes secretKey
    * @param {Uint8Array} option account option
    * @returns {UserAccount} user account
  */
  public static privateKeyToUserAccount (privateKey: Uint8Array, option: AccountOption): UserAccount {
    if (privateKey.length !== 32) {
      // sanity check
      throw new Error('invalid private key length - UserAccount.privateKeyToUserAccount');
    }

    const userAccount = new UserAccount(option);

    userAccount.unlock(privateKey);

    return userAccount;
  }

  /**
    * create an UserAccount object from a mnemonic seed
    * @param {string} seed a 12 words seed
    * @param {AccountOption} option account option
    * @returns {UserAccount} user account
  */
  public static seedToUserAccount (seed: string, option: AccountOption): UserAccount {
    if (!mnemonicValidate(seed)) {
      throw new Error('invalid seed - UserAccount.seedToUserAccount');
    }

    const privateKey = mnemonicToMiniSecret(seed);

    return UserAccount.privateKeyToUserAccount(privateKey, option);
  }

  /**
    * encrypt the privateKey of the user and lock the account
    * @param {Uint8Array} passwordHash password hash, always bhe 32 bytes long
    * @returns {void} None
  */
  public encryptUserAccount (passwordHash: Uint8Array): void {
    if (this.isLocked) {
      throw new Error('account has been locked locked - UserAccount.lockUserAccount');
    }

    if (passwordHash.length !== 32) {
      throw new Error('invalid password hash length - UserAccount.lockUserAccount');
    }

    const encryptedPrivateKey = SymmetricEncryption.encrypt(passwordHash, this.privateKey);

    // original key size + encryption overhead + nonce
    if (encryptedPrivateKey.length !== 32 + 16 + 24) {
      throw new Error('invalid encrypted private key length - UserAccount.lockUserAccount');
    }

    this.lock();
    this.encryptedPrivateKey = encryptedPrivateKey;
  }

  /**
    * Decrypt the user private key and unlock the account
    * @param {Uint8Array} passwordHash password hash
    * @returns {void} None
  */
  public decryptUserAccount (passwordHash: Uint8Array): void {
    if (this.encryptedPrivateKey && this.encryptedPrivateKey.length !== 32 + 16 + 24) {
      throw new Error('invalid encrypted private key length - UserAccount.decryptUserAccount');
    }

    if (passwordHash.length !== 32) {
      throw new Error('invalid password hash length - UserAccount.decryptUserAccount');
    }

    const privateKey = SymmetricEncryption.decrypt(passwordHash, this.encryptedPrivateKey);

    if (privateKey.length !== 32) {
      throw new Error('invalid private key length - UserAccount.decryptUserAccount');
    }

    this.unlock(privateKey);
  }

  // Account Serde
  /**
    * get the length of serializedLength
    * @returns {number} size of the serializedLength
  */
  public static serializedLength (): number {
    return 33 + // publicKey len
      // we pad all public keys to 33 bytes so that secp256k1 keys can fit as well
      +AccountOption.serializedLength();
  }

  // account serialize does not include private key info
  /**
   * serialize user account
   * @returns {Uint8Array} serialized user account
  */
  public serialize (): Uint8Array {
    if (!this.publicKey) {
      throw new Error('account is not initialized - UserAccount.serialize');
    }

    const res = new Uint8Array(UserAccount.serializedLength());

    res.set(this.publicKey, 0);
    res.set(this.option.serialize(), 33);

    return res;
  }

  /**
    * deserialize user account
    * @param {Uint8Array} data serialized user account
    * @returns {Uint8Array} deserialized user account
  */
  public static deserialize (data: Uint8Array): UserAccount {
    if (data.length !== UserAccount.serializedLength()) {
      throw new Error('invalid data length - UserAccount.deserialize');
    }

    const option = AccountOption.deserialize(data.slice(33, 33 + AccountOption.serializedLength()));
    const publicKey = (['ecdsa', 'ethereum'].includes(option.keyType)) ? data.slice(0, 33) : data.slice(0, 32);

    // We also encode an address!
    const address = (['ecdsa', 'ethereum'].includes(option.keyType)) ? ethereumEncode(publicKey) : encodeAddress(publicKey);

    const userAccount = new UserAccount(option);

    userAccount.publicKey = publicKey;
    userAccount.address = address;

    return userAccount;
  }

  /**
    * get the length of serializedLength plus the length of EncryptedKey
    * @returns {number} size of the serializedLength plus the length of EncryptedKey
  */
  public static serializedLengthWithEncryptedKey (): number {
    return UserAccount.serializedLength() + 72;
  }

  // account serialize does not include CLEARTEXT private key info
  /**
   * serialize user account with EncryptedKey
   * @returns {Uint8Array} serialized user account with EncryptedKey
  */
  public serializeWithEncryptedKey (): Uint8Array {
    if (!this.encryptedPrivateKey || this.encryptedPrivateKey.length !== 72) {
      throw new Error('invalid encryptedPrivateKey - UserAccount.serializeWithEncryptedKey');
    }

    const res = new Uint8Array(UserAccount.serializedLengthWithEncryptedKey());

    res.set(this.serialize(), 0);
    res.set(this.encryptedPrivateKey, UserAccount.serializedLength());

    return res;
  }

  /**
   * deserialize user account with EncryptedKey
   * @param {Uint8Array} data serialized user account with EncryptedKey
   * @returns {Uint8Array} deserialized user account with EncryptedKey
  */
  public static deserializeWithEncryptedKey (data: Uint8Array): UserAccount {
    if (data.length !== UserAccount.serializedLengthWithEncryptedKey()) {
      throw new Error('invalid data length - UserAccount.deserializeWithEncryptedKey');
    }

    const userAccount = UserAccount.deserialize(data.slice(0, UserAccount.serializedLength()));

    userAccount.encryptedPrivateKey = data.slice(UserAccount.serializedLength(), UserAccount.serializedLength() + 72);

    return userAccount;
  }
}

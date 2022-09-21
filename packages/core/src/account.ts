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
  localKeyEncryptionStrategy: number; // 1='password-v0' | 2='webauthn';
  hasEncryptedPrivateKeyExported: boolean;
  // whether the user had exported the private key to email
  // set to be true when
  //      1. the account is imported from unencrypted private key link
  //      2. the account has click the link to export private key via link to email

  version?: Version;

  constructor (option: IAccountOption) {
    this.keyType = option.keyType;
    this.localKeyEncryptionStrategy = option.localKeyEncryptionStrategy;
    this.hasEncryptedPrivateKeyExported = option.hasEncryptedPrivateKeyExported;
    this.version = option.version ? option.version : CURRENT_VERSION;
  }

  public validate (): boolean {
    return this.keyType && (this.localKeyEncryptionStrategy > 0 || this.localKeyEncryptionStrategy < 2);
  }

  public static serializedLength (): number {
    return 1 + // keyType
      1 + // localKeyEncryptionStrategy
      1 + // hasEncryptedPrivateKeyExported
      1; // version
  }

  // account serialize does not include private key info
  public serialize (): Uint8Array {
    const res = new Uint8Array(AccountOption.serializedLength());

    res.set([Util.keypairTypeStringToNumber(this.keyType)], 0);
    res.set([this.localKeyEncryptionStrategy], 1);
    res.set([this.hasEncryptedPrivateKeyExported ? 1 : 0], 2);
    res.set([this.version], 3);

    return res;
  }

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

export interface ILockedPrivateKey {
  encryptedPrivateKey: Uint8Array; // fixed size = 32 bytes + 24 bytes nonce + 16 bytes overhead
  option: AccountOption;
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

  public lock (): void {
    delete this.privateKey;
    this.isLocked = true;
  }

  public unlock (privateKey: Uint8Array): void {
    if (privateKey.length !== 32) {
      throw new Error('invalid private key length - UserAccount.unlock');
    }

    this.privateKey = privateKey;
    this.isLocked = false;
  }

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

  public async signMessage (message: Uint8Array): Promise<Uint8Array> {
    if (this.isLocked) {
      throw new Error('account is locked - UserAccount.signMessage');
    }

    await cryptoWaitReady();

    const kr = (new Keyring({
      type: this.option.keyType
    })).addFromSeed(this.privateKey);

    return kr.sign(message);
  }

  public static privateKeyToUserAccount (privateKey: Uint8Array, option: AccountOption): UserAccount {
    if (privateKey.length !== 32) {
      // sanity check
      throw new Error('invalid private key length - UserAccount.privateKeyToUserAccount');
    }

    const userAccount = new UserAccount(option);

    userAccount.unlock(privateKey);

    return userAccount;
  }

  public static seedToUserAccount (seed: string, option: AccountOption): UserAccount {
    if (!mnemonicValidate(seed)) {
      throw new Error('invalid seed - UserAccount.seedToUserAccount');
    }

    const privateKey = mnemonicToMiniSecret(seed);

    return UserAccount.privateKeyToUserAccount(privateKey, option);
  }

  public lockUserAccount (passwordHash: Uint8Array): LockedPrivateKey {
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

    return new LockedPrivateKey({
      encryptedPrivateKey: encryptedPrivateKey,
      option: this.option
    });
  }

  public static unlockUserAccount (lockedPrivateKey: LockedPrivateKey, passwordHash: Uint8Array): UserAccount {
    if (lockedPrivateKey.encryptedPrivateKey.length !== 32 + 16 + 24) {
      throw new Error('invalid encrypted private key length - UserAccount.unlockUserAccount');
    }

    if (passwordHash.length !== 32) {
      throw new Error('invalid password hash length - UserAccount.unlockUserAccount');
    }

    const privateKey = SymmetricEncryption.decrypt(passwordHash, lockedPrivateKey.encryptedPrivateKey);

    if (privateKey.length !== 32) {
      throw new Error('invalid private key length - UserAccount.unlockUserAccount');
    }

    const userAccount = new UserAccount(lockedPrivateKey.option);

    userAccount.unlock(privateKey);

    return userAccount;
  }

  // Account Serde & Account Index

  public static serializedLength (): number {
    return 33 + // publicKey len
      +AccountOption.serializedLength();
  }

  // account serialize does not include private key info
  public serialize (): Uint8Array {
    if (!this.publicKey) {
      throw new Error('account is not initialized - UserAccount.serialize');
    }

    const res = new Uint8Array(UserAccount.serializedLength());

    res.set(this.publicKey, 0);
    res.set(this.option.serialize(), 33);

    return res;
  }

  public static deserialize (data: Uint8Array): UserAccount {
    if (data.length !== UserAccount.serializedLength()) {
      throw new Error('invalid data length - UserAccount.deserialize');
    }

    const option = AccountOption.deserialize(data.slice(33, 33 + AccountOption.serializedLength()));
    const publicKey = (['ecdsa', 'ethereum'].includes(option.keyType)) ? data.slice(0, 33) : data.slice(0, 32);
    const address = (['ecdsa', 'ethereum'].includes(option.keyType)) ? ethereumEncode(publicKey) : encodeAddress(publicKey);

    const userAccount = new UserAccount(option);

    userAccount.publicKey = publicKey;
    userAccount.address = address;

    return userAccount;
  }
}

export class LockedPrivateKey implements ILockedPrivateKey {
  encryptedPrivateKey: Uint8Array; // fixed size = 32 bytes + 24 bytes nonce + 16 bytes overhead
  option: AccountOption;

  constructor (config: {
    encryptedPrivateKey: Uint8Array,
    option: AccountOption,
  }) {
    const { encryptedPrivateKey, option } = config;

    if (encryptedPrivateKey.length !== 32 + 16 + 24) {
      throw new Error('invalid encrypted private key length - LockedPrivateKey.constructor');
    }

    if (!option.validate()) {
      throw new Error('invalid UserAccount option - LockedPrivateKey.constructor');
    }

    this.encryptedPrivateKey = encryptedPrivateKey;
    this.option = option;
  }

  public static serializedLength (): number {
    return 32 + 16 + 24 + // encryptedPrivateKey len
      +AccountOption.serializedLength();
  }

  public serialize (): Uint8Array {
    if (!this.encryptedPrivateKey) {
      throw new Error('invalid key - LockedPrivateKey.serialize');
    }

    const res = new Uint8Array(LockedPrivateKey.serializedLength());

    res.set(this.encryptedPrivateKey, 0);
    res.set(this.option.serialize(), 72);

    return res;
  }

  public static deserialize (data: Uint8Array): LockedPrivateKey {
    if (data.length !== LockedPrivateKey.serializedLength()) {
      throw new Error('invalid data length - LockedPrivateKey.deserialize');
    }

    const encryptedPrivateKey = data.slice(0, 32 + 16 + 24);
    const option = AccountOption.deserialize(data.slice(72, 72 + AccountOption.serializedLength()));

    const lockedPrivateKey = new LockedPrivateKey({
      encryptedPrivateKey: encryptedPrivateKey,
      option: option
    });

    return lockedPrivateKey;
  }
}

// Copyright 2021-2022 @choko-wallet/core authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Keyring, { encodeAddress as polkadotEncodeAddress } from '@polkadot/keyring';
import { ethereumEncode, mnemonicToEntropy, mnemonicValidate } from '@polkadot/util-crypto';
import { entropyToMnemonic } from '@polkadot/util-crypto/mnemonic/bip39';
import { initWASMInterface, SymmetricEncryption } from '@skyekiwi/crypto';
import { hexToU8a } from '@skyekiwi/util';
import { ethers } from 'ethers';

import { getSmartWalletAddress } from '@choko-wallet/account-abstraction';
import { chokoWalletDefaultProviders } from '@choko-wallet/account-abstraction/fixtures';

import { KeypairType } from './types';
import { AccountOption } from '.';

export interface IUserAccount {
  // CORE FIELDS
  entropy?: Uint8Array;
  encryptedEntropy?: Uint8Array;

  option: AccountOption;

  // DERIVED
  isLocked: boolean;
  publicKeys: Uint8Array[];

  aaWalletAddress?: string;

  serialize(): Uint8Array;
}

export class UserAccount implements IUserAccount {
  entropy?: Uint8Array;
  encryptedEntropy?: Uint8Array;

  option: AccountOption;

  isLocked: boolean;

  publicKeys: Uint8Array[];

  aaWalletAddress?: string;

  constructor (option: AccountOption) {
    if (!option.validate()) {
      throw new Error('invalide option - UserAccount.constructor');
    }

    this.publicKeys = [];
    this.option = option;
    this.isLocked = true;
  }

  /**
  * remove privateKey from account and lock the account
  */
  public lock (): void {
    delete this.entropy;
    this.isLocked = true;
  }

  /**
  * unlock account
  * @param {string} seed mnemonic phrase
  */
  public unlock (seed: string): void {
    if (!mnemonicValidate(seed)) {
      throw new Error('invalid seed phrase - UserAccount.unlock');
    }

    this.entropy = mnemonicToEntropy(seed);
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

    await initWASMInterface();
    const seed = entropyToMnemonic(this.entropy);

    this.publicKeys = [];
    ['sr25519', 'ed25519', 'ethereum'].map((type) => {
      const t = type as KeypairType;

      if (t === 'ethereum') {
        const ethersJsWallet = ethers.Wallet.fromMnemonic(seed);
        const privateKey = hexToU8a(ethersJsWallet.privateKey.slice(2));
        const kr = (new Keyring({ type: t })).addFromSeed(privateKey);

        this.publicKeys.push(kr.publicKey);
      } else {
        const kr = (new Keyring({ type: t })).addFromMnemonic(seed);

        this.publicKeys.push(kr.publicKey);
      }

      return null;
    });

    this.aaWalletAddress = await this.getAAWwalletAddress();
  }

  public async getAAWwalletAddress (index = 0): Promise<string> {
    return await getSmartWalletAddress(
      chokoWalletDefaultProviders[5], // we use goerli, AA address is the same cross-chains
      ethereumEncode(this.publicKeys[2]),
      index
    );
  }

  public getPublicKey (keyType: KeypairType): Uint8Array {
    if (this.publicKeys.length !== 3) {
      throw new Error('account not properly initiated - UserAccount.getAddress');
    }

    switch (keyType) {
      case 'sr25519': return this.publicKeys[0];
      case 'ed25519': return this.publicKeys[1];
      case 'ethereum': return this.publicKeys[2];
      case 'ecdsa': return this.publicKeys[2];
    }
  }

  public getAddress (keyType: KeypairType): string {
    if (this.publicKeys.length !== 3) {
      throw new Error('account not properly initiated - UserAccount.getAddress');
    }

    switch (keyType) {
      case 'sr25519': return polkadotEncodeAddress(this.getPublicKey(keyType));
      case 'ed25519': return polkadotEncodeAddress(this.getPublicKey(keyType));
      case 'ethereum': return ethereumEncode(this.getPublicKey(keyType));
      case 'ecdsa': return polkadotEncodeAddress(this.getPublicKey(keyType));
    }
  }

  // account secret handling
  /**
    * encrypt the seed of the user and lock the account
    * @param {Uint8Array} passwordHash password hash, always be 32 bytes long
    * @returns {void} None
  */
  public encryptUserAccount (passwordHash: Uint8Array): void {
    if (this.isLocked) {
      throw new Error('account has been locked locked - UserAccount.encryptUserAccount');
    }

    if (passwordHash.length !== 32) {
      throw new Error('invalid password hash length - UserAccount.encryptUserAccount');
    }

    const encryptedEntropy = SymmetricEncryption.encrypt(passwordHash, this.entropy);

    // entropy size + encryption overhead + nonce
    if (encryptedEntropy.length !== 16 + 16 + 24) {
      throw new Error('invalid encrypted private key length - UserAccount.encryptUserAccount');
    }

    this.lock();
    this.encryptedEntropy = encryptedEntropy;
  }

  /**
    * Decrypt the user private key and unlock the account
    * @param {Uint8Array} passwordHash password hash
    * @returns {void} None
  */
  public decryptUserAccount (passwordHash: Uint8Array): void {
    if (this.encryptedEntropy && this.encryptedEntropy.length !== 16 + 16 + 24) {
      throw new Error('invalid encrypted private key length - UserAccount.decryptUserAccount');
    }

    if (passwordHash.length !== 32) {
      throw new Error('invalid password hash length - UserAccount.decryptUserAccount');
    }

    const entropy = SymmetricEncryption.decrypt(passwordHash, this.encryptedEntropy);

    if (entropy.length !== 16) {
      // sanity check
      throw new Error('invalid private key length - UserAccount.decryptUserAccount');
    }

    this.unlock(entropyToMnemonic(entropy));
  }

  // Account Serde
  /**
    * get the length of serializedLength
    * @returns {number} size of the serializedLength
  */
  public static serializedLength (): number {
    return 32 + 32 + 33 + // length of all publicKeys len
      // we pad all public keys to 33 bytes so that secp256k1 keys can fit as well
      +AccountOption.serializedLength();
  }

  // account serialize does not include private key info
  /**
   * serialize user account
   * @returns {Uint8Array} serialized user account
  */
  public serialize (): Uint8Array {
    if (this.publicKeys.length !== 3) {
      throw new Error('account is not properly initialized - UserAccount.serialize');
    }

    const res = new Uint8Array(UserAccount.serializedLength());

    res.set(this.publicKeys[0], 0); // sr25519
    res.set(this.publicKeys[1], 32); // ed25519
    res.set(this.publicKeys[2], 32 + 32); // secp256k1
    res.set(this.option.serialize(), 32 + 32 + 33);

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

    const publicKeys = [
      data.slice(0, 32), // sr25519
      data.slice(32, 32 + 32), // ed25519
      data.slice(32 + 32, 32 + 32 + 33) // secp256k1
    ];
    const option = AccountOption.deserialize(data.slice(32 + 32 + 33, 32 + 32 + 33 + AccountOption.serializedLength()));

    const userAccount = new UserAccount(option);

    userAccount.publicKeys = publicKeys;

    return userAccount;
  }

  /**
    * get the length of serializedLength plus the length of EncryptedKey
    * @returns {number} size of the serializedLength plus the length of EncryptedKey
  */
  public static serializedLengthWithEncryptedKey (): number {
    return UserAccount.serializedLength() + 16 + 16 + 24;
  }

  // account serialize does not include CLEARTEXT private key info
  /**
   * serialize user account with EncryptedKey
   * @returns {Uint8Array} serialized user account with EncryptedKey
  */
  public serializeWithEncryptedKey (): Uint8Array {
    if (!this.encryptedEntropy || this.encryptedEntropy.length !== 16 + 16 + 24) {
      throw new Error('invalid encryptedEntropy - UserAccount.serializeWithEncryptedKey');
    }

    const res = new Uint8Array(UserAccount.serializedLengthWithEncryptedKey());

    res.set(this.serialize(), 0);
    res.set(this.encryptedEntropy, UserAccount.serializedLength());

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

    userAccount.encryptedEntropy = data.slice(UserAccount.serializedLength(), UserAccount.serializedLength() + 16 + 16 + 24);

    return userAccount;
  }
}

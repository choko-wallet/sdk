// Copyright 2021-2022 @choko-wallet/core authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeypairType } from '@choko-wallet/core/types';

import Keyring, { encodeAddress as polkadotEncodeAddress } from '@polkadot/keyring';
import { ethereumEncode, mnemonicToEntropy, mnemonicValidate, mnemonicGenerate } from '@polkadot/util-crypto';
import { entropyToMnemonic } from '@polkadot/util-crypto/mnemonic/bip39';
import { SymmetricEncryption } from '@skyekiwi/crypto';
import { hexToU8a } from '@skyekiwi/util';

import { AccountOption } from './options';
import { LocalAccount, mnemonicToAccount } from 'viem/accounts';

export class EoaAccount {
  entropy?: Uint8Array;
  encryptedEntropy?: Uint8Array;

  option: AccountOption;
  isLocked: boolean = true;
  publicKeys: Uint8Array[] = [];

  constructor (option: AccountOption) {
    if (!option.validate()) {
      throw new Error('invalide option - EoaAccount.constructor');
    }

    this.option = option;
  }

  /* Testing Only */
  public random(): void {
    const mnemonic = mnemonicGenerate();
    console.log(mnemonic);
    this.unlock(mnemonic);
    this.init();
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
    * @returns {void} None.
  */
  public init (): void {
    if (this.isLocked) {
      throw new Error('account is locked - UserAccount.init');
    }

    const seed = entropyToMnemonic(this.entropy);

    const act = mnemonicToAccount(seed);
    const pubKey = hexToU8a(act.publicKey.slice(2));
    
    // Edward curve publicKey
    const edKr = (new Keyring({ type: 'ed25519' })).addFromMnemonic(seed);

    this.publicKeys = [pubKey, edKr.publicKey];
  }

  public getPublicKey (keyType: KeypairType): Uint8Array {
    if (this.publicKeys.length !== 2) {
      throw new Error('account not properly initiated - UserAccount.getAddress');
    }

    switch (keyType) {
      case 'ethereum': return this.publicKeys[0];
      case 'ed25519': return this.publicKeys[1];
    }
  }

  public getAddress (keyType: KeypairType): string {
    if (this.publicKeys.length !== 2) {
      throw new Error('account not properly initiated - UserAccount.getAddress');
    }

    switch (keyType) {
      case 'ethereum': return ethereumEncode(this.getPublicKey(keyType));
      case 'ed25519': return polkadotEncodeAddress(this.getPublicKey(keyType));
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
      // unexpected!!
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
    return 33 + 32 + // length of all publicKeys len
      // we pad all public keys to 33 bytes so that secp256k1 keys can fit as well
      +AccountOption.serializedLength();
  }

  // account serialize does not include private key info
  /**
   * serialize user account
   * @returns {Uint8Array} serialized user account
  */
  public serialize (): Uint8Array {
    if (this.publicKeys.length !== 2) {
      throw new Error('account is not properly initialized - EoaAccount.serialize');
    }

    const res = new Uint8Array(EoaAccount.serializedLength());

    res.set(this.publicKeys[0], 0); // ethereum
    res.set(this.publicKeys[1], 33); // ed25519
    res.set(this.option.serialize(), 33 + 32);

    return res;
  }

  /**
    * deserialize user account
    * @param {Uint8Array} data serialized user account
    * @returns {Uint8Array} deserialized user account
  */
  public static deserialize (data: Uint8Array): EoaAccount {
    if (data.length !== EoaAccount.serializedLength()) {
      throw new Error('invalid data length - UserAccount.deserialize');
    }

    const publicKeys = [
      data.slice(0, 33), // ed25519
      data.slice(33, 33 + 32) // secp256k1
    ];
    const option = AccountOption.deserialize(data.slice(33 + 32, 33 + 32 + AccountOption.serializedLength()));

    const userAccount = new EoaAccount(option);

    userAccount.publicKeys = publicKeys;

    return userAccount;
  }

  /**
    * get the length of serializedLength plus the length of EncryptedKey
    * @returns {number} size of the serializedLength plus the length of EncryptedKey
  */
  public static serializedLengthWithEncryptedKey (): number {
    return EoaAccount.serializedLength() + 16 + 16 + 24;
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

    const res = new Uint8Array(EoaAccount.serializedLengthWithEncryptedKey());

    res.set(this.serialize(), 0);
    res.set(this.encryptedEntropy, EoaAccount.serializedLength());

    return res;
  }

  /**
   * deserialize user account with EncryptedKey
   * @param {Uint8Array} data serialized user account with EncryptedKey
   * @returns {Uint8Array} deserialized user account with EncryptedKey
  */
  public static deserializeWithEncryptedKey (data: Uint8Array): EoaAccount {
    if (data.length !== EoaAccount.serializedLengthWithEncryptedKey()) {
      throw new Error('invalid data length - UserAccount.deserializeWithEncryptedKey');
    }

    const userAccount = EoaAccount.deserialize(data.slice(0, EoaAccount.serializedLength()));

    userAccount.encryptedEntropy = data.slice(EoaAccount.serializedLength(), EoaAccount.serializedLength() + 16 + 16 + 24);

    return userAccount;
  }

  public toViemAccount(): LocalAccount {
    if (this.isLocked) {
      throw new Error('account is locked - UserAccount.toViemAccount');
    }
    const mnemonic = entropyToMnemonic(this.entropy);
    const account = mnemonicToAccount(mnemonic);

    return {
      address: account.address,
      publicKey: account.publicKey,
      signMessage: account.signMessage,
      signTransaction: account.signTransaction,
      signTypedData: account.signTypedData,

      source: 'custom',
      type: 'local'
    }
  }
}

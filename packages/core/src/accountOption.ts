// Copyright 2021-2022 @choko-wallet/core authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CURRENT_VERSION, Version } from './types';

export interface IAccountOption {
  accountType: 0 | 1, // 0 = plain seed, 1 = mpc
  hasEncryptedPrivateKeyExported: boolean;
  // whether the user had exported the private key to email
  // set to be true when
  //      1. the account is imported from unencrypted private key link
  //      2. the account has click the link to export private key via link to email

  localKeyEncryptionStrategy: number; // 1='password-v0' | 2='webauthn';
  version?: Version;
}

export class AccountOption implements IAccountOption {
  accountType: 0 | 1; // 0 = plain seed, 1 = mpc
  hasEncryptedPrivateKeyExported: boolean;
  localKeyEncryptionStrategy: number;
  version?: Version;

  constructor (option: IAccountOption) {
    this.accountType = option.accountType;
    this.hasEncryptedPrivateKeyExported = option.hasEncryptedPrivateKeyExported;
    this.localKeyEncryptionStrategy = option.localKeyEncryptionStrategy;
    this.version = option.version ? option.version : CURRENT_VERSION;
  }

  /**
     * validate if the AccountOption is valid
     * @returns {boolean} the validity of the AccountOption
    */
  public validate (): boolean {
    return this.localKeyEncryptionStrategy > 0 || this.localKeyEncryptionStrategy < 3;
  }

  /**
      * get the length of serializedLength
      * @returns {number} size of the serializedLength
    */
  public static serializedLength (): number {
    return 1 + // accountType
        1 + // hasEncryptedPrivateKeyExported
        1 + // localKeyEncryptionStrategy
        1; // version
  }

  /**
     * serialize AccountOption
     * @returns {Uint8Array} serialized AccountOption
   */
  public serialize (): Uint8Array {
    const res = new Uint8Array(AccountOption.serializedLength());

    res.set([this.accountType], 0);
    res.set([this.hasEncryptedPrivateKeyExported ? 1 : 0], 1);
    res.set([this.localKeyEncryptionStrategy], 2);
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

    const accountType = data[0];

    if (accountType !== 0 && accountType !== 1) {
      throw new Error('invalid account type - AccountOption.deserialize');
    }

    const hasEncryptedPrivateKeyExported = data[1] === 1;
    const localKeyEncryptionStrategy = data[2];
    const version = data[3];

    return new AccountOption({
      accountType, hasEncryptedPrivateKeyExported, localKeyEncryptionStrategy, version
    });
  }
}

export const defaultAccountOption = new AccountOption({
  accountType: 0,
  hasEncryptedPrivateKeyExported: false,
  localKeyEncryptionStrategy: 0
});

export const defaultMpcAccountOption = new AccountOption({
  accountType: 1,
  hasEncryptedPrivateKeyExported: false,
  localKeyEncryptionStrategy: 0
});

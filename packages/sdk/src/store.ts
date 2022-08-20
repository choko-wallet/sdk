// Copyright 2021-2022 @choko-wallet/sdk authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { hexToU8a, u8aToHex } from '@skyekiwi/util';

import { UserAccount } from '@choko-wallet/core';
import { DappDescriptor } from '@choko-wallet/core/dapp';
import { compressParameters, decompressParameters } from '@choko-wallet/core/util';

export const storeUserAccount = (account: UserAccount): void => {
  if (!account.isLocked) {
    throw new Error('account must be locked before stored - sdk/store:storeUserAccount');
  }

  localStorage.setItem('userAccount',
    u8aToHex(compressParameters(account.serialize()))
  );
};

export const getUserAccount = (): UserAccount => {
  const data = localStorage.getItem('userAccount');

  if (!data) {
    throw new Error('no user account found - sdk/store:getUserAccount');
  }

  return UserAccount.deserialize(decompressParameters(hexToU8a(data)));
};

export const storeDappDescriptor = (dapp: DappDescriptor): void => {
  localStorage.setItem('dapp',
    u8aToHex(compressParameters(dapp.serialize()))
  );
};

export const getDappDescriptor = (): DappDescriptor => {
  const data = localStorage.getItem('dapp');

  if (!data) {
    throw new Error('no dapp found - sdk/store:getDappDescriptor');
  }

  return DappDescriptor.deserialize(decompressParameters(hexToU8a(data)));
};

export const storeCallBackUrl = (url: string): void => {
  localStorage.setItem('callbackUrl', url);
};

export const getCallBackUrl = (): string => {
  return localStorage.getItem('callbackUrl');
};

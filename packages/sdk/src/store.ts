// Copyright 2021-2022 @choko-wallet/sdk authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { InMemoryStorage } from './type';

import { UserAccount } from '@choko-wallet/core';
import { DappDescriptor } from '@choko-wallet/core/dapp';
import { compressParameters, decompressParameters } from '@choko-wallet/core/util';

import { hexToU8a, u8aToHex } from '@skyekiwi/util';

export const storeUserAccount = (store: InMemoryStorage, account: UserAccount): InMemoryStorage => {
  if (!account.isLocked) {
    throw new Error('account must be locked before stored - sdk/store:storeUserAccount');
  }

  store.userAccount = u8aToHex(compressParameters(account.serialize()));

  return store;
};

export const hasUserAccountStored = (store: InMemoryStorage): boolean => {
  const data = store.userAccount;

  return !!data;
};

export const getUserAccount = (store: InMemoryStorage): UserAccount => {
  if (!hasUserAccountStored(store)) {
    throw new Error('no user account found - sdk/store:getUserAccount');
  }

  const data = store.userAccount;

  return UserAccount.deserialize(decompressParameters(hexToU8a(data)));
};

export const storeDappDescriptor = (store: InMemoryStorage, dapp: DappDescriptor): InMemoryStorage => {
  store.dappDescriptor = u8aToHex(compressParameters(dapp.serialize()));

  return store;
};

export const getDappDescriptor = (store: InMemoryStorage): DappDescriptor => {
  const data = store.dappDescriptor;

  return DappDescriptor.deserialize(decompressParameters(hexToU8a(data)));
};

export const persistStorage = (store: InMemoryStorage): void => {
  window.localStorage.setItem('userAccount', store.userAccount);
  window.localStorage.setItem('dappDescriptor', store.dappDescriptor);
};

export const purgeStorage = (): void => {
  window.localStorage.removeItem('userAccount');
  window.localStorage.removeItem('dappDescriptor');
};

export const loadStorage = (): InMemoryStorage => {
  return {
    dappDescriptor: window.localStorage.getItem('dappDescriptor'),
    userAccount: window.localStorage.getItem('userAccount')
  };
};

// export const persistStorage = (store: InMemoryStorage): void => {}
// export const purgeStorage = (store: InMemoryStorage): void => {}
// export const loadStorage = (): InMemoryStorage => {
//   return {
//     userAccount: null,
//     dappDescriptor: null,
//   }
// }

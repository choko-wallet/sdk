// Copyright 2021-2022 @choko-wallet/sdk authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SDKConfig } from './type';

import { UserAccount } from '@choko-wallet/core';
import { DappDescriptor } from '@choko-wallet/core/dapp';
import { CURRENT_VERSION } from '@choko-wallet/core/types';
import { knownNetworks } from '@choko-wallet/known-networks';

import { storeCallBackUrl, storeDappDescriptor, storeUserAccount } from '.';

export const validateConfig = (config: SDKConfig): string => {
  // 1. AccountCreatioOption
  const accountCreationOptionIsValidV0 = (): boolean => {
    const { keyType, localKeyEncryptionStrategy } = config.accountCreationOption;

    return keyType === 'sr25519' &&
      localKeyEncryptionStrategy === 0;
    // hasEncryptedPrivateKeyExported can be either thing
  };

  const activeNetworkHashIsValidV0 = (): boolean => {
    const { activeNetworkHash } = config;

    return activeNetworkHash.length === 16 &&
      !!knownNetworks[activeNetworkHash];
  };

  const nameIsValidV0 = (): boolean => {
    const { displayName, infoName } = config;

    return displayName.length > 0 && infoName.length > 0 &&
      displayName.length < 32 && infoName.length < 32;
  };

  const versionIsValidV0 = (): boolean => {
    const { version } = config;

    return version === 0;
  };

  const callbackUrlIsValidV0 = (): boolean => {
    const { callbackUrlBase } = config;

    return !!callbackUrlBase;
  };

  return (accountCreationOptionIsValidV0() ? '' : 'Invalid AccountCreationOption') as string +
  (activeNetworkHashIsValidV0() ? '' : 'Invalid activeNetworkHash') +
  (nameIsValidV0() ? '' : 'Invalid name') +
  (versionIsValidV0() ? '' : 'Invalid version') +
  (callbackUrlIsValidV0() ? '' : 'Invalid callbackUrlBase');
};

export const configSDK = (config: SDKConfig): [DappDescriptor, UserAccount] => {
  const invalidReason = validateConfig(config);

  if (invalidReason) {
    throw new Error(invalidReason);
  }

  // 1. config the DappDescriptor
  const dappDescriptor = new DappDescriptor({
    activeNetwork: knownNetworks[config.activeNetworkHash],
    displayName: config.displayName,
    infoName: config.infoName,
    version: CURRENT_VERSION
  });

  // 2. config the UserAccount
  const { accountCreationOption } = config;
  const account = new UserAccount(accountCreationOption);

  // 2.1 assign empty public key
  account.publicKey = new Uint8Array(32);

  return [dappDescriptor, account];
};

export const configSDKAndStore = (config: SDKConfig): void => {
  const [dappDescriptor, account] = configSDK(config);

  storeUserAccount(account);
  storeDappDescriptor(dappDescriptor);
  storeCallBackUrl(config.callbackUrlBase);
};

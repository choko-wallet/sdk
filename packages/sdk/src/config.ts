// Copyright 2021-2022 @choko-wallet/sdk authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { InMemoryStorage, SDKConfig } from './type';

import { AccountOption, DappDescriptor } from '@choko-wallet/core';
import { CURRENT_VERSION } from '@choko-wallet/core/types';
import { knownNetworks } from '@choko-wallet/known-networks';

import { loadStorage, persistStorage, storeDappDescriptor } from '.';

/**
  * validate a SDKConfig
  * @param {SDKConfig} config the SDKConfig to be validated
  * @returns {string} returns messages related to the error. If empty, all good!
*/
// TODO: does it worth it to implements an Error system for this?
export const validateConfig = (config: SDKConfig): string => {
  // 1. AccountCreatioOption
  const accountOptionIsValidV0 = (): boolean => {
    return new AccountOption(config.accountOption).validate();
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

  return (accountOptionIsValidV0() ? '' : 'Invalid AccountCreationOption ') as string +
  (activeNetworkHashIsValidV0() ? '' : 'Invalid activeNetworkHash ') +
  (nameIsValidV0() ? '' : 'Invalid name ') +
  (versionIsValidV0() ? '' : 'Invalid version ');
};

/**
  * INTERNAL config SDKConfig and generate the standard objects needed
  * @param {SDKConfig} config the SDKConfig to be proceed
  * @returns {[DappDescriptor, UserAccount]} return a parsed DappDescriptor and a (locked) UserAccount
*/
const parseSDKConfig = (config: SDKConfig): DappDescriptor => {
  const invalidReason = validateConfig(config);

  if (invalidReason) {
    throw new Error(invalidReason);
  }

  return new DappDescriptor({
    activeNetwork: knownNetworks[config.activeNetworkHash],
    displayName: config.displayName,
    infoName: config.infoName,
    version: CURRENT_VERSION
  });
};

/**
  * Config SDK and store information locally in localStorage
  * @param {SDKConfig} config the SDKConfig to be proceed
  * @returns {void} None. Will store relevant information in localStorage
*/
export const configSDK = (config: SDKConfig, persist = true): InMemoryStorage => {
  const dappDescriptor = parseSDKConfig(config);

  const store = storeDappDescriptor(loadStorage(), dappDescriptor);

  if (persist) {
    persistStorage(store);
  }

  return store;
};

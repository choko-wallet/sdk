// Copyright 2021-2022 @choko-wallet/sdk authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SDKConfig } from './type';

import { AccountOption, DappDescriptor, UserAccount } from '@choko-wallet/core';
import { CURRENT_VERSION } from '@choko-wallet/core/types';
import { knownNetworks } from '@choko-wallet/known-networks';

import { storeCallBackUrl, storeDappDescriptor, storeUserAccount } from '.';

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

  const callbackUrlIsValidV0 = (): boolean => {
    const { callbackUrlBase } = config;

    return !!callbackUrlBase;
  };

  return (accountOptionIsValidV0() ? '' : 'Invalid AccountCreationOption ') as string +
  (activeNetworkHashIsValidV0() ? '' : 'Invalid activeNetworkHash ') +
  (nameIsValidV0() ? '' : 'Invalid name ') +
  (versionIsValidV0() ? '' : 'Invalid version ') +
  (callbackUrlIsValidV0() ? '' : 'Invalid callbackUrlBase ');
};

/**
  * INTERNAL config SDKConfig and generate the standard objects needed
  * @param {SDKConfig} config the SDKConfig to be proceed
  * @returns {[DappDescriptor, UserAccount]} return a parsed DappDescriptor and a (locked) UserAccount
*/
const parseSDKConfig = (config: SDKConfig): [DappDescriptor, UserAccount] => {
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
  const { accountOption } = config;
  const account = new UserAccount(new AccountOption(accountOption));

  // 2.1 assign empty public key
  account.publicKey = new Uint8Array(32);

  return [dappDescriptor, account];
};

/**
  * Config SDK and store information locally in localStorage
  * @param {SDKConfig} config the SDKConfig to be proceed
  * @param {UserAccount} act (optional) UserAccount to inject
  * @returns {void} None. Will store relevant information in localStorage
*/
export const configSDK = (config: SDKConfig, act?: UserAccount): void => {
  const [dappDescriptor, account] = parseSDKConfig(config);

  storeUserAccount(act || account);
  storeDappDescriptor(dappDescriptor);
  storeCallBackUrl(config.callbackUrlBase);
};

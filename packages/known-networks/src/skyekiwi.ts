// Copyright 2021-2022 @choko-wallet/known-networks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString, NetworkType } from '@choko-wallet/core/types';

import { hexToU8a } from '@skyekiwi/util';

import { INetwork } from '@choko-wallet/core';

export class SkyeKiwiNetwork implements INetwork {
  providers: Record<string, string>;
  defaultProvider: string;
  networkType: NetworkType;
  info: string;
  text: string;

  nativeTokenSymbol: string;
  nativeTokenDecimal: number;

  ss58Prefix?: number;
  homepage?: string;
  isChild?: boolean;
  isDevelopment?: boolean;
  isDisabled?: boolean;
  isUnreachable?: boolean;
  paraId?: number;
  summary?: string;
  color?: string;
  logo?: Uint8Array;

  constructor () {
    this.info = 'skyekiwi';
    this.text = 'SkyeKiwi Network';
    this.homepage = 'https://skye.kiwi';
    this.networkType = 'polkadot';

    this.nativeTokenSymbol = 'SKW';
    this.nativeTokenDecimal = 12;

    this.ss58Prefix = 42;
    this.isDevelopment = true;
    this.providers = {
      SkyeKiwi: 'wss://staging.rpc.skye.kiwi'
    };
    this.defaultProvider = 'wss://staging.rpc.skye.kiwi';
    this.color = '#6667ab';
  }

  public serialize (): Uint8Array {
    // return Util.xxHash(this.info);
    return hexToU8a(SkyeKiwiNetworkHash);
  }
}

export const SkyeKiwiNetworkHash: HexString = '847e7b7fa160d85f'; // xxHash('skyekiwi');

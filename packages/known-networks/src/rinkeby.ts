// Copyright 2021-2022 @choko-wallet/known-networks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString, NetworkType } from '@choko-wallet/core/types';

import { INetwork } from '@choko-wallet/core';
import { xxHash } from '@choko-wallet/core/util';

import { hexToU8a, u8aToHex } from '@skyekiwi/util';

/* eslint-disable sort-keys */

export class RinkebyNetwork implements INetwork {
  providers: Record<string, string>;
  defaultProvider: string;
  networkType: NetworkType;
  info: string;
  text: string;

  nativeTokenSymbol: string;
  nativeTokenDecimal: number;

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
    this.info = 'rinkeby';
    this.text = 'Rinkeby Network';
    this.homepage = 'https://rinkeby.etherscan.io/';
    this.networkType = 'ethereum';

    this.nativeTokenSymbol = 'RinkebyETH';
    this.nativeTokenDecimal = 18;

    this.isDisabled = true;
    this.isDevelopment = true;

    this.providers = {
      Rinkeby: 'wss://rinkeby.infura.io/ws/v3/dc6c26f799af4a57b0ca5f37b50558c2'
    };
    this.defaultProvider = 'wss://rinkeby.infura.io/ws/v3/dc6c26f799af4a57b0ca5f37b50558c2';
    this.color = '#627FE5';
  }

  public serialize (): Uint8Array {
    // return Util.xxHash(this.info);
    return hexToU8a(RinkebyNetworkHash);
  }
}

export const RinkebyNetworkHash: HexString = u8aToHex(xxHash('rinkeby'));

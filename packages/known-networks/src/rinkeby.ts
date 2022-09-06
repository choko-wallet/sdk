// Copyright 2021-2022 @choko-wallet/known-networks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@choko-wallet/core/types';

import { hexToU8a, u8aToHex } from '@skyekiwi/util';

import { INetwork } from '@choko-wallet/core';
import { xxHash } from '@choko-wallet/core/util';

/* eslint-disable sort-keys */

export class RinkebyNetwork implements INetwork {
  providers: Record<string, string>;
  defaultProvider: string;
  info: string;
  text: string;
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

    this.providers = {
      Rinkeby: 'wss://main-light.eth.linkpool.io/ws'
    };
    this.defaultProvider = 'wss://main-light.eth.linkpool.io/ws';
  }

  public serialize (): Uint8Array {
    // return Util.xxHash(this.info);
    return hexToU8a(RinkebyNetworkHash);
  }
}

export const RinkebyNetworkHash: HexString = u8aToHex(xxHash('rinkeby'));

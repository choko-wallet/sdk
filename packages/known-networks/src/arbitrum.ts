// Copyright 2021-2022 @choko-wallet/known-networks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString, NetworkType } from '@choko-wallet/core/types';

import { hexToU8a, u8aToHex } from '@skyekiwi/util';

import { INetwork } from '@choko-wallet/core';
import { xxHash } from '@choko-wallet/core/util';

/* eslint-disable sort-keys */
export class ArbitrumNetwork implements INetwork {
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
    this.info = 'arbitrum';
    this.text = 'Arbitrum Mainnet';
    this.homepage = 'https://arbitrum.io';
    this.networkType = 'ethereum';
    this.nativeTokenSymbol = 'ETH';
    this.nativeTokenDecimal = 18;

    this.isDisabled = true;
    this.providers = {
    //   Ethereum: 'wss://mainnet.infura.io/ws/v3/cdc0f422bf7f40e0bd2dcded8b62e878'
    };
    this.defaultProvider = '';

    this.color = '#FF0420';
  }

  public serialize (): Uint8Array {
    // return Util.xxHash(this.info);
    return hexToU8a(ArbitrumNetworkHash);
  }
}

export const ArbitrumNetworkHash: HexString = u8aToHex(xxHash('arbitrum'));

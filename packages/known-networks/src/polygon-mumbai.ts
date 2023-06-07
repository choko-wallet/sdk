// Copyright 2021-2022 @choko-wallet/known-networks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString, NetworkType } from '@choko-wallet/core/types';

import { INetwork } from '@choko-wallet/core';
import { xxHash } from '@choko-wallet/core/util';

import { hexToU8a, u8aToHex } from '@skyekiwi/util';

/* eslint-disable sort-keys */

export class PolygonMumbaiNetwork implements INetwork {
  providers: Record<string, string>;
  defaultProvider: string;
  networkType: NetworkType;
  info: string;
  text: string;

  nativeTokenSymbol: string;
  nativeTokenDecimal: number;

  chainId: number;

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
    this.info = 'polygon-mumbai';
    this.text = 'Polygon Mumbai';
    this.homepage = 'https://polygon.technology/';
    this.networkType = 'ethereum';
    this.nativeTokenSymbol = 'MATIC';
    this.nativeTokenDecimal = 18;
    this.chainId = 80001;

    this.providers = {
      //   Ethereum: 'wss://mainnet.infura.io/ws/v3/cdc0f422bf7f40e0bd2dcded8b62e878'
    };
    this.defaultProvider = 'wss://ws-matic-mumbai.chainstacklabs.com';
    this.isDevelopment = true;
    this.color = '#8247e5';
  }

  public serialize (): Uint8Array {
    // return Util.xxHash(this.info);
    return hexToU8a(PolygonMumbaiNetworkHash);
  }
}

export const PolygonMumbaiNetworkHash: HexString = u8aToHex(xxHash('polygon-mumbai'));

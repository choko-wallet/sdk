// Copyright 2021-2022 @choko-wallet/known-networks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString, NetworkType } from '@choko-wallet/core/types';

import { hexToU8a, u8aToHex } from '@skyekiwi/util';

import { INetwork } from '@choko-wallet/core';
import { xxHash } from '@choko-wallet/core/util';

/* eslint-disable sort-keys */

export class PolkadotNetwork implements INetwork {
  providers: Record<string, string>;
  defaultProvider: string;
  networkType: NetworkType;
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
    this.info = 'polkadot';
    this.text = 'Polkadot Network';
    this.homepage = 'https://polkadot.network';
    this.networkType = 'polkadot';

    this.providers = {
      Parity: 'wss://rpc.polkadot.io',
      OnFinality: 'wss://polkadot.api.onfinality.io/public-ws',
      Dwellir: 'wss://polkadot-rpc.dwellir.com',
      Pinknode: 'wss://public-rpc.pinknode.io/polkadot',
      RadiumBlock: 'wss://polkadot.public.curie.radiumblock.io/ws'
    };
    this.defaultProvider = 'wss://rpc.polkadot.io';
  }

  public serialize (): Uint8Array {
    // return Util.xxHash(this.info);
    return hexToU8a(PolkadotNetworkHash);
  }
}

export const PolkadotNetworkHash: HexString = u8aToHex(xxHash('polkadot'));

// Copyright 2021-2022 @choko-wallet/known-networks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@choko-wallet/core/types';

import { hexToU8a, u8aToHex } from '@skyekiwi/util';

import { INetwork } from '@choko-wallet/core';
import { xxHash } from '@choko-wallet/core/util';

/* eslint-disable sort-keys */

export class KusamaNetwork implements INetwork {
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
    this.info = 'kusama';
    this.text = 'Kusama Network';
    this.homepage = 'https://polkadot.network';

    this.providers = {
      Parity: 'wss://kusama-rpc.polkadot.io',
      OnFinality: 'wss://kusama.api.onfinality.io/public-ws',
      Dwellir: 'wss://kusama-rpc.dwellir.com',
      RadiumBlock: 'wss://kusama.public.curie.radiumblock.xyz/ws',
      Pinknode: 'wss://public-rpc.pinknode.io/kusama'
    };
    this.defaultProvider = 'wss://kusama-rpc.polkadot.io';
  }

  public serialize (): Uint8Array {
    return hexToU8a(KusamaNetworkHash);
  }
}

export const KusamaNetworkHash: HexString = u8aToHex(xxHash('kusama'));

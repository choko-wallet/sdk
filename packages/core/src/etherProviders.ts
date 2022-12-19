// Copyright 2021-2022 @choko-wallet/core authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { JsonRpcProvider } from '@ethersproject/providers';

export const chainIdToProvider: Record<number, JsonRpcProvider> = {
  1: new JsonRpcProvider('https://mainnet.infura.io/v3/b0125dff016648ed815d5698dfb80b25'),
  137: new JsonRpcProvider('https://polygon-mainnet.g.alchemy.com/v2/mqinV2_-2mL1ZUObw5KNLylyOSkWkIzi'), // polygon
  5: new JsonRpcProvider('https://goerli.infura.io/v3/b0125dff016648ed815d5698dfb80b25', 'goerli'),
  56: new JsonRpcProvider('https://rpc.ankr.com/bsc'),
  80001: new JsonRpcProvider('https://polygon-mumbai.g.alchemy.com/v2/nfLNPHILQKFIhP3HnL-0rI9tpwnaJ7ac'),
  97: new JsonRpcProvider('https://rpc.ankr.com/bsc_testnet_chapel')
};

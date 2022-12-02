// Copyright 2021-2022 @choko-wallet/core authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { JsonRpcProvider } from '@ethersproject/providers';

export const chainIdToProvider: Record<number, JsonRpcProvider> = {
  1: new JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/xhYxjr_vrHG6NrQhCA79tAH9MJ2NOwfc'),
  137: new JsonRpcProvider('https://polygon-mainnet.g.alchemy.com/v2/mqinV2_-2mL1ZUObw5KNLylyOSkWkIzi'), // polygon
  5: new JsonRpcProvider('https://eth-goerli.g.alchemy.com/v2/70wjS92mV7V63UCiARGJFJW95dJTldV-', 'goerli'),
  56: new JsonRpcProvider('https://rpc.ankr.com/bsc'),
  80001: new JsonRpcProvider('https://polygon-mumbai.g.alchemy.com/v2/nfLNPHILQKFIhP3HnL-0rI9tpwnaJ7ac'),
  97: new JsonRpcProvider('https://rpc.ankr.com/bsc_testnet_chapel')
};

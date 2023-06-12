// Copyright 2021-2022 @choko-wallet/token-price authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Address } from 'viem';

export type BalanceAndPrice = {
  balance: bigint;
  decimal: bigint;
  name: string;
  price: number;
  symbol: string;
}

export type BalanceInfo = {
  nativeToken: BalanceAndPrice;
  fungibleTokens: { [key: string]: BalanceAndPrice }
}

export type TokenData = {
  [key: string]: {
    'coingeckoId': string,
    'symbol': string,
    'name': string,
    'image': string,
    'contractAddress': { [key: string]: Address }
  }
}

// Copyright 2021-2022 @choko-wallet/assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { u8aToHex } from '@skyekiwi/util';

import { Asset, AssetInfo, EthereumAsset, PolkadotAsset } from '@choko-wallet/core/types';
import { xxHash } from '@choko-wallet/core/util';

const usdtInfo: AssetInfo = {
  displayName: 'USDT',
  infoName: 'usdt',
  website: 'lol'
};
const usdtEth: EthereumAsset = {
  info: usdtInfo,
  tokenAddress: {},
  tokenType: 'FungibleToken'
};
const usdtPolkadot: PolkadotAsset = {
  info: usdtInfo
};

usdtEth.tokenAddress[u8aToHex(xxHash('goerli'))] = '0x509Ee0d083DdF8AC028f2a56731412edD63223B9';

const usdt: Asset = [usdtEth, usdtPolkadot];

export default usdt;

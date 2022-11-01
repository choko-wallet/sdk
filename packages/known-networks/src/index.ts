// Copyright 2021-2022 @choko-wallet/known-networks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { KnownNetworks } from '@choko-wallet/core';

import { ArbitrumNetwork, ArbitrumNetworkHash } from './arbitrum';
import { ArbitrumGoerliNetwork, ArbitrumGoerliNetworkHash } from './arbitrum-goerli';
import { EthereumNetwork, EthereumNetworkHash } from './ethereum';
import { GoerliNetwork, GoerliNetworkHash } from './goerli';
import { KusamaNetwork, KusamaNetworkHash } from './kusama';
import { OptimismNetwork, OptimismNetworkHash } from './optimism';
import { OptimismGoerliNetwork, OptimismGoerliNetworkHash } from './optimism-goerli';
import { PolkadotNetwork, PolkadotNetworkHash } from './polkadot';
import { PolygonNetwork, PolygonNetworkHash } from './polygon';
import { PolygonGoerliNetwork, PolygonGoerliNetworkHash } from './polygon-goerli';
import { PolygonMumbaiNetwork, PolygonMumbaiNetworkHash } from './polygon-mumbai';
import { RinkebyNetwork, RinkebyNetworkHash } from './rinkeby';
import { SkyeKiwiNetwork, SkyeKiwiNetworkHash } from './skyekiwi';

/* eslint-disable sort-keys */
export const knownNetworks: KnownNetworks = {
  [SkyeKiwiNetworkHash]: new SkyeKiwiNetwork(),
  [PolkadotNetworkHash]: new PolkadotNetwork(),
  [KusamaNetworkHash]: new KusamaNetwork(),
  [RinkebyNetworkHash]: new RinkebyNetwork(),
  [GoerliNetworkHash]: new GoerliNetwork(),
  [EthereumNetworkHash]: new EthereumNetwork(),

  [PolygonNetworkHash]: new PolygonNetwork(),
  [PolygonMumbaiNetworkHash]: new PolygonMumbaiNetwork(),
  [PolygonGoerliNetworkHash]: new PolygonGoerliNetwork(),

  [ArbitrumNetworkHash]: new ArbitrumNetwork(),
  [ArbitrumGoerliNetworkHash]: new ArbitrumGoerliNetwork(),

  [OptimismNetworkHash]: new OptimismNetwork(),
  [OptimismGoerliNetworkHash]: new OptimismGoerliNetwork()
};

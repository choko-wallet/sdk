// Copyright 2021-2022 @choko-wallet/known-networks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { KnownNetworks } from '@choko-wallet/core';

import { KusamaNetwork, KusamaNetworkHash } from './kusama';
import { PolkadotNetwork, PolkadotNetworkHash } from './polkadot';
import { RinkebyNetwork, RinkebyNetworkHash } from './rinkeby';
import { SkyeKiwiNetwork, SkyeKiwiNetworkHash } from './skyekiwi';

/* eslint-disable sort-keys */

export const knownNetworks: KnownNetworks = {
  [SkyeKiwiNetworkHash]: new SkyeKiwiNetwork(),
  [PolkadotNetworkHash]: new PolkadotNetwork(),
  [KusamaNetworkHash]: new KusamaNetwork(),
  [RinkebyNetworkHash]: new RinkebyNetwork()
};

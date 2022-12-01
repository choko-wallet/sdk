// Copyright 2021-2022 @choko-wallet/sdk authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@choko-wallet/core/types';

import { IAccountOption } from '@choko-wallet/core';

export interface SDKConfig {
  accountOption: IAccountOption;
  activeNetworkHash: HexString;

  displayName: string;
  infoName: string;

  version: number;
}

export type InMemoryStorage = {
  userAccount: string,
  dappDescriptor: string,
}

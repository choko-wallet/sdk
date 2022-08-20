// Copyright 2021-2022 @choko-wallet/sdk authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AccountCreationOption } from '@choko-wallet/core/account';
import { HexString } from '@choko-wallet/core/types';

export interface SDKConfig {
  accountCreationOption: AccountCreationOption;
  activeNetworkHash: HexString;

  callbackUrlBase: string;

  displayName: string;
  infoName: string;

  version: number;
}

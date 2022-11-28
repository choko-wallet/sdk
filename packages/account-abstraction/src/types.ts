// Copyright 2021-2022 @choko-wallet/account-abstraction authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BigNumberish } from 'ethers';

export interface IMetaTransaction {
  to: string
  value?: BigNumberish
  data?: string
  operation?: number
}

export interface IWalletTransaction extends IMetaTransaction {
  targetTxGas?: string | number
  baseGas?: string | number
  gasPrice?: string | number
  gasToken?: string
  tokenGasPriceFactor?: string | number
  refundReceiver?: string
  nonce?: number
}

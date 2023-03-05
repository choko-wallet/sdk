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
  nonce?: string | number
}

export type BiconomyUserOperation = {
  sender: string;
  nonce: number;
  initCode: string;
  callData: string;
  callGasLimit: number;
  verificationGasLimit: number;
  preVerificationGas: number;
  maxFeePerGas: number;
  maxPriorityFeePerGas: number;
  paymasterAndData: string;
  signature: string;
};

export type BiconomyFixtureOnNetwork = {
  walletFactoryAddress: string,
  multiSendAddress: string,
  entryPointAddress: string,
  fallbackHandlerAddress: string,
}

export type BiconomyFixture = Record<number, BiconomyFixtureOnNetwork>;

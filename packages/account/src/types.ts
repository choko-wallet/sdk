// Copyright 2021-2022 @choko-wallet/account-abstraction authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Address, Hex } from 'viem';

export interface IUserOperation {
  sender: Address;
  nonce: bigint;

  initCode: {
    needsDeployment: boolean;
    factoryAddress: Address;
    calldata: Hex;
  };

  callData: Hex;
  callGasLimit: bigint;

  verificationGasLimit: bigint;
  preVerificationGas: bigint;

  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;

  paymasterAndData: Hex;
  signature: Hex;
}

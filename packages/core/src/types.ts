// Copyright 2021-2022 @choko-wallet/core authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BigNumberish } from 'ethers';

// Base Types
export type Version = number;
export type Color = string;
export type Image = Uint8Array;
export type Hash = Uint8Array;

export type Address = string;
export type HexString = string;
export type AccountBalance = number;
export type KeypairType = 'ed25519' | 'ethereum';

export type NetworkType = 'polkadot' | 'ethereum';

export enum SignMessageType {
  RawEd25519,
  EthereumPersonalSign,
}

export enum SignTxType {
  Ordinary,
  AACall,
  AACallBatch,
  Gasless,
  GaslessBatch,
}

const CURRENT_VERSION = 0;

export { CURRENT_VERSION };

export interface IMiniEthTransaction {
  data: string,
  to: string,
  value: BigNumberish,
  gasLimit?: BigNumberish,
}
export interface ITxResponse {
  txHash: Uint8Array,
  blockNumber: number,
}

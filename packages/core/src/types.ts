// Copyright 2021-2022 @choko-wallet/core authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Base Types
export type Version = number;
export type Color = string;
export type Image = Uint8Array;
export type Hash = Uint8Array;

export type Address = string;
export type HexString = string;
export type AccountBalance = number;
export type KeypairType = 'ed25519' | 'sr25519' | 'ecdsa' | 'ethereum';

export type NetworkType = 'polkadot' | 'ethereum';
// export type SignMessageType = 'raw-sr25519' | 'raw-ed25519' | 'ethereum-personal';

export enum SignMessageType {
  RawSr25519,
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

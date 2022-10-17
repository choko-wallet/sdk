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

const CURRENT_VERSION = 0;

export { CURRENT_VERSION };

export type TokenType = 'FungibleToken' | 'NonFungibleToken';

export interface AssetInfo {
  displayName: string;
  infoName: string;
  website: string;
}

export interface EthereumAsset {
  info: AssetInfo;
  tokenAddress: Record<HexString, Address>, // hash of the Network => token contract address
  tokenType: TokenType;
}

export interface PolkadotAsset {
  info: AssetInfo,
  // TBD
}

export type Asset = [EthereumAsset, PolkadotAsset];

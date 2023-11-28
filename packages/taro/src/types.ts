// Copyright 2021-2022 @choko-wallet/taro authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface TaroAssets {
  assetType: 'NORMAL' | 'COLLECTIBLE',
  name: string,
  assetMeta?: string,
  amount: number,
  groupKey?: string,
  groupAnchor?: string,
}

export interface MintRequest {
  asset: TaroAssets,
  enableEmission: boolean
}

export interface TaroConfig {
  TARO_SERVER_URL: string,
  MACAROON_PATH: string
}

export interface TaroAssets {
  asset_type: 'NORMAL' | 'COLLECTIBLE',
  name: string,
  asset_meta?: string,
  amount: number,
  group_key?: string,
  group_anchor?: string,
}

export interface MintRequest {
  asset: TaroAssets,
  enable_emission: boolean
}

export interface TaroConfig {
  TARO_SERVER_URL: string,
  MACAROON_PATH: string
}
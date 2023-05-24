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
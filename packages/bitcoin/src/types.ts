export const UTXO_DUST = 546;

export enum AddressType {
  P2PKH,
  P2WPKH,
  P2TR,
  P2SH_P2WPKH,
  M44_P2WPKH,
  M44_P2TR,
}

export interface SimpleOrd {
    id: string,
    offset: number,
}

export interface Ord {
  id: string,
  outputOffset: number,
  unitOffset: number,
}

export interface OrdUnit {
  sat: number,
  ords: Ord[]
}

export interface Utxo {
  txId: string,
  outputIndex: number,
  sat: number,

  scriptPk: string,
  addressType: AddressType,
  address: string,

  ords: SimpleOrd[]
}

export interface TxInput {
  data: {
    hash: string,
    index: number,
    witnessUtxo: {value: number, script: Buffer},
    tapInternalKey?: Buffer,
    redeemScript?: Buffer,
  },

  utxo: Utxo,
}

export interface TxOutput {
  address: string,
  value: number
}
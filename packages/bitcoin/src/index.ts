// Copyright 2021-2023 @choko-wallet/ens authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Utxo } from "./types";

const sendBtc = (
  privateKey: Uint8Array,

  utxo: Utxo[],

  toAddress: string,
  amount: number,

  network: 'bitcoin' | 'testnet',

  changeAddress: string,
  
  feeRate = 5,
  receiverToPayFee = false,
) => {
  
}
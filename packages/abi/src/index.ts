// Copyright 2021-2022 @choko-wallet/abi authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { UnsignedTransaction } from 'ethers';
import type { HexString } from '@choko-wallet/core/types';

import { ethers } from 'ethers';

import { abis } from './abi';

const loadAbi = (abiName: string, abi?: string): ethers.utils.Interface => {
  const abiContent = abis[abiName];
  let i;

  if (abiContent) {
    i = new ethers.utils.Interface(abiContent);
  } else {
    i = new ethers.utils.Interface(abi);
  }

  return i;
};

const encodeContractCall = (
  abiName: string, // '',
  functionName: string, // 'transfer',
  params: any[], // [ addressToSend, (amount * Math.pow(10, 18)).toString()],
  abi?: string// LinkTokenABI
): HexString => {
  const i = loadAbi(abiName, abi);
  const encoded = i.encodeFunctionData(
    functionName, params
  );

  return encoded;// .slice(2);
};

const decodeContractCall = (
  abiName: string,
  transaction: ethers.Transaction,
  abi?: string
): ethers.utils.TransactionDescription => {
  const i = loadAbi(abiName, abi);

  return i.parseTransaction({ data: transaction.data, value: transaction.value });
};

const encodeTransaction = (
  tx: UnsignedTransaction
): HexString => {
  return ethers.utils.serializeTransaction(tx);
};

const decodeTransaction = (
  data: HexString
): ethers.Transaction => {
  return ethers.utils.parseTransaction(data);
};

export { encodeContractCall, decodeContractCall, decodeTransaction, encodeTransaction, loadAbi };
export type { UnsignedTransaction };

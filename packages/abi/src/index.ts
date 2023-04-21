// Copyright 2021-2022 @choko-wallet/abi authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { UnsignedTransaction } from 'ethers';
import type { HexString } from '@choko-wallet/core/types';

import { ethers } from 'ethers';
import { ERC20_ABI } from './fixtures/erc20';
import { ERC721_ABI } from './fixtures/erc721';
import { ENS_ABI, RESOLVER_ABI } from './fixtures/ens';
import { AAFACTORY_ABI, AAWALLET_ABI, MULTISEND_ABI } from './fixtures/aa';

const abiNameMapping: { [key: string]: string[] | string } = {
  'erc20': ERC20_ABI,
  'erc721': ERC721_ABI,
  
  'ens': ENS_ABI,
  'ens-resolver': RESOLVER_ABI,

  'aa-multisend': MULTISEND_ABI,
  'aa-walletFactory': AAFACTORY_ABI,
  'aa-wallet': AAWALLET_ABI,
}

const loadAbi = (abiName: string, abi?: string): ethers.utils.Interface => {
  const abiContent: string[] | string = abiNameMapping[abiName];
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

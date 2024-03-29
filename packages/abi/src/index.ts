// Copyright 2021-2022 @choko-wallet/abi authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Abi, Hex, TransactionSerializable } from 'viem';

import { decodeFunctionData, encodeFunctionData, parseTransaction, serializeTransaction } from 'viem';

import { AAFACTORY_ABI, AAWALLET_ABI } from './fixtures/aa';
import { ENS_ABI, RESOLVER_ABI } from './fixtures/ens';
import { ERC20_ABI } from './fixtures/erc20';
import { ERC721_ABI } from './fixtures/erc721';

const loadAbi = (abiName: string, abi?: Abi): Abi => {
  switch (abiName) {
    case 'erc20': return ERC20_ABI;
    case 'erc721': return ERC721_ABI;
    case 'ens': return ENS_ABI;
    case 'ens-resolver': return RESOLVER_ABI;
    case 'aa-walletFactory': return AAFACTORY_ABI;
    case 'aa-wallet': return AAWALLET_ABI;

    default: {
      if (abi) {
        return abi;
      }

      throw new Error(`Unknown abi: ${abiName}`);
    }
  }
};

const encodeContractCall = (
  abiName: string, // '',
  functionName: string, // 'transfer',
  args: any[], // [ addressToSend, (amount * Math.pow(10, 18)).toString()],
  abi?: Abi// LinkTokenABI
): Hex => {
  const encoded = encodeFunctionData({
    abi: loadAbi(abiName, abi),
    args,
    functionName
  });

  return encoded;// .slice(2);
};

const decodeContractCall = (
  abiName: string,
  data: Hex,
  abi?: Abi
): {
  args: readonly unknown[];
  functionName: string;
} => {
  return decodeFunctionData({
    abi: loadAbi(abiName, abi), data
  });
};

const encodeTransaction = (tx: TransactionSerializable): Hex => {
  return serializeTransaction(tx);
};

const decodeTransaction = (data: Hex): TransactionSerializable => {
  return parseTransaction(data);
};

export { encodeContractCall, decodeContractCall, decodeTransaction, encodeTransaction, loadAbi };

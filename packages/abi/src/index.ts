// Copyright 2021-2022 @choko-wallet/abi authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@choko-wallet/core/types';
import { ethers } from 'ethers';
import { Result } from 'ethers/lib/utils';
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
  abiName: string,//'',
  functionName: string,//'transfer',
  params: any[],//[ addressToSend, (amount * Math.pow(10, 18)).toString()],
  abi?: string//LinkTokenABI
): HexString => {
  const i = loadAbi(abiName, abi);
  const encoded = i.encodeFunctionData(
    functionName, params
  );

  return encoded;// .slice(2);
};


const decodeContractCall = (
  abiName: string,//'',
  functionName: string,
  data: HexString,
  abi?: string//LinkTokenABI
): Result => {
  const i = loadAbi(abiName, abi);
  const decoded = i.decodeFunctionData(
    functionName, data
  );

  return decoded;
};

export { encodeContractCall, decodeContractCall };

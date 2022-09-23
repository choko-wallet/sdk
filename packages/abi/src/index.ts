// Copyright 2021-2022 @choko-wallet/abi authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
  abiName: string,

  functionName: string,
  params: any[],

  abi?: string
): HexString => {
  const i = loadAbi(abiName, abi);
  const encoded = i.encodeFunctionData(
    functionName, params
  );

  return encoded;// .slice(2);
};

export { encodeContractCall };

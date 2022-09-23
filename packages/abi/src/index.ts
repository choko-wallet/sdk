// Copyright 2021-2022 @choko-wallet/abi authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@choko-wallet/core/types';
import { ethers } from 'ethers';


const knownAbi: {[key: string]: string} = {
  'test': 'test.abi.json',
  'erc20': 'erc20.abi.json',
  'erc721': 'erc721.abi.json',
}

const useAbi = (abiName: string, abi?: string): ethers.utils.Interface => {

  const abiFile = knownAbi[abiName];
  let i;

  if (abiFile) {
    const path = `./abi/${abiFile}`;
    try {
      const a = require(path);

      i = new ethers.utils.Interface(a); 
    } catch(e) {
      // load failed?
    }

  } else {
    const a = JSON.parse(abi);
    i = new ethers.utils.Interface(a);
  }

  return i;
}

const encodeContractCall = (
  abiName: string,

  functionName: string,
  params: any[],

  abi?: string,
): HexString => {

  const i = useAbi(abiName, abi);
  const encoded = i.encodeFunctionData(
    functionName, params
  );

  return encoded//.slice(2);
}

export {encodeContractCall};
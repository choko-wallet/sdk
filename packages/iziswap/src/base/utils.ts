/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
// Copyright 2021-2023 @choko-wallet/iziswap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { getSwapTokenAddress } from './token';
import { TokenInfoFormatted } from './types';

function num2Hex (n: number) {
  if (n < 10) {
    return String(n);
  }

  const str = 'ABCDEF';

  return str[n - 10];
}

function fee2Hex (fee: number): string {
  const n0 = fee % 16;
  const n1 = Math.floor(fee / 16) % 16;
  const n2 = Math.floor(fee / 256) % 16;
  const n3 = Math.floor(fee / 4096) % 16;
  const n4 = 0;
  const n5 = 0;

  return '0x' + num2Hex(n5) + num2Hex(n4) + num2Hex(n3) + num2Hex(n2) + num2Hex(n1) + num2Hex(n0);
}

function appendHex (hexString: string, newHexString: string): string {
  return hexString + newHexString.slice(2);
}

export const parallelCollect = async <T>(
  ...promiseList: Promise<T>[]
): Promise<T[]> => {
  const results: T[] = Array(promiseList.length);

  for (const i in promiseList) {
    if (!promiseList[i]) {
      continue;
    }

    promiseList[i].then((r: T) => (results[i] = r));
  }

  await Promise.all(promiseList);

  return results;
};

export const getTokenChainPath = (tokenChain: TokenInfoFormatted[], feeChain: number[]): string => {
  let hexString = getSwapTokenAddress(tokenChain[0]);

  for (let i = 0; i < feeChain.length; i++) {
    hexString = appendHex(hexString, fee2Hex(feeChain[i]));
    hexString = appendHex(hexString, getSwapTokenAddress(tokenChain[i + 1]));
  }

  return hexString;
};

export const getTokenChainPathReverse = (tokenChain: TokenInfoFormatted[], feeChain: number[]): string => {
  let hexString = getSwapTokenAddress(tokenChain[tokenChain.length - 1]);

  for (let i = feeChain.length - 1; i >= 0; i--) {
    hexString = appendHex(hexString, fee2Hex(feeChain[i]));
    hexString = appendHex(hexString, getSwapTokenAddress(tokenChain[i]));
  }

  return hexString;
};

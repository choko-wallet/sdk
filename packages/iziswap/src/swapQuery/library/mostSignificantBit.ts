/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
// Copyright 2021-2023 @choko-wallet/iziswap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import JSBI from 'jsbi';

import { Consts } from './consts';

const POWERS_OF_2 = [128, 64, 32, 16, 8, 4, 2, 1].map((pow: number): [number, JSBI] => [
  pow,
  JSBI.exponentiate(Consts.TWO, JSBI.BigInt(pow))
]);

export function mostSignificantBit (x: JSBI): number {
  let msb = 0;

  for (const [power, min] of POWERS_OF_2) {
    if (JSBI.greaterThanOrEqual(x, min)) {
      x = JSBI.signedRightShift(x, JSBI.BigInt(power));
      msb += power;
    }
  }

  return msb;
}

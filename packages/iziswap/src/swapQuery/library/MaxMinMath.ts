/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
// Copyright 2021-2023 @choko-wallet/iziswap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import JSBI from 'jsbi';

export namespace MaxMinMath {

  export function min (a: JSBI, b: JSBI): JSBI {
    return JSBI.greaterThan(a, b) ? b : a;
  }

  export function max (a: JSBI, b: JSBI): JSBI {
    return JSBI.greaterThan(a, b) ? a : b;
  }

}

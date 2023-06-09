/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
// Copyright 2021-2023 @choko-wallet/iziswap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import JSBI from 'jsbi';

export namespace SwapQuery {

  export interface State {
    sqrtPrice_96: JSBI
    currentPoint: number
    liquidity: JSBI
    liquidityX: JSBI
  }

}

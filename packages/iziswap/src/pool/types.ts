/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
// Copyright 2021-2023 @choko-wallet/iziswap authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface BaseState {
  currentPoint: number,
  liquidity: string,
  liquidityX: string
}

export interface State extends BaseState {

  sqrtPrice_96: string,
  observationCurrentIndex: number,
  observationQueueLen: number,
  observationNextQueueLen: number
}

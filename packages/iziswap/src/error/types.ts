/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
// Copyright 2021-2023 @choko-wallet/iziswap authors & contributors
// SPDX-License-Identifier: Apache-2.0

export enum SDKModule {
  SWAP_QUERY = 'SWAP_QUERY',
  POOL = 'POOL'
}

export class iZiSwapError extends Error {
  code: string
  module: SDKModule
  constructor (module: SDKModule, code: string, msg = '') {
    super(msg);
    this.code = code;
    this.module = module;
  }
}

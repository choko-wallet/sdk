/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
// Copyright 2021-2023 @choko-wallet/iziswap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { iZiSwapError, SDKModule } from '../error/types';

export enum PoolErrCode {
  LEFTPT_GREATER_THAN_CURRENTPT_ERROR = 'LEFTPT_GREATER_THAN_CURRENTPT_ERROR',
  RIGHTPT_LESS_THAN_CURRENTPT_ERROR = 'RIGHTPT_LESS_THAN_CURRENTPT_ERROR'
}

export class PoolError extends iZiSwapError {
  constructor (code: PoolErrCode, msg: string) {
    super(SDKModule.POOL, code as string, msg);
  }
}

export const poolInvariant = (cond: boolean, code: PoolErrCode, msg = ''): void => {
  if (!cond) {
    throw new PoolError(code, msg);
  }
};

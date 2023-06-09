/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
// Copyright 2021-2023 @choko-wallet/iziswap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BigNumber } from 'bignumber.js';

import { ChainId, getChain, TokenInfoFormatted } from '../types';
// const memoizeOne = require('memoize-one')
import abi from './erc20.json';

export const amount2Decimal = (amount: BigNumber, token: TokenInfoFormatted): number => {
  return Number(amount.div(10 ** token.decimal));
};

export const decimal2Amount = (amountDecimal: number, token: TokenInfoFormatted): BigNumber => {
  return new BigNumber(amountDecimal).times(10 ** token.decimal);
};

export const getSwapTokenAddress = (token: TokenInfoFormatted): string => {
  return token.wrapTokenAddress ?? token.address;
};

export const isGasToken = (token: TokenInfoFormatted, chainId: ChainId): boolean => {
  if (!token || !chainId) {
    return false;
  }

  const chain = getChain(chainId);
  const chainTokenAddress = chain?.token.address ?? '';

  if (
    token.chainId === chainId &&
        token.symbol === chain?.tokenSymbol &&
        token.address.toLowerCase() === chainTokenAddress.toLowerCase()
  ) {
    return true;
  }

  return false;
};

export const isGasOrWrappedGasToken = (token: TokenInfoFormatted, chainId: ChainId): boolean => {
  if (!token || !chainId) {
    return false;
  }

  const chain = getChain(chainId);
  const chainTokenAddress = chain?.token.address ?? '';

  if (token.chainId === chainId && token.address.toLowerCase() === chainTokenAddress.toLowerCase()) {
    return true;
  }

  return false;
};

export const isWrappedGasToken = (token: TokenInfoFormatted, chainId: ChainId): boolean => {
  if (!token || !chainId) {
    return false;
  }

  const chain = getChain(chainId);
  const chainTokenAddress = chain?.token.address ?? '';

  if (
    token.chainId === chainId &&
        token.symbol !== chain?.tokenSymbol &&
        token.address.toLowerCase() === chainTokenAddress.toLowerCase()
  ) {
    return true;
  }

  return false;
};

export const getGasToken = (chainId: ChainId): TokenInfoFormatted => {
  const chain = getChain(chainId);

  if (!!chain?.token.address && !!chain?.token.symbol && !!chain?.token.decimal) {
    return {
      chainId,
      address: chain?.token.address,
      symbol: chain?.token.symbol,
      decimal: chain?.token.decimal
    };
  }

  return undefined as unknown as TokenInfoFormatted;
};

export const getWrappedGasTokenIfExists = (chainId: ChainId): TokenInfoFormatted => {
  const chain = getChain(chainId);

  if (!!chain?.wrappedToken?.address && !!chain?.wrappedToken?.symbol && !!chain?.wrappedToken?.decimal) {
    return {
      chainId,
      address: chain?.wrappedToken.address,
      symbol: chain?.wrappedToken.symbol,
      decimal: chain?.wrappedToken.decimal
    };
  }

  return undefined as unknown as TokenInfoFormatted;
};

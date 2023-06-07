/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
// Copyright 2021-2023 @choko-wallet/iziswap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as ethers from 'ethers';
import { getSwapTokenAddress, getTokenChainPath, getTokenChainPathReverse, TokenInfoFormatted } from 'iziswap-sdk/lib/base';
import { QuoterSwapChainWithExactInputParams, QuoterSwapChainWithExactOutputParams } from 'iziswap-sdk/lib/quoter/types';
import { State as PoolState } from 'iziswap-sdk/src/pool';

import Erc20ABI from './abi/erc20.json';

// to get iZiSwap pool address of token pair (testA, testB, fee)
const getPoolAddress = async (
  liquidityManagerContract: ethers.Contract,
  tokenA: TokenInfoFormatted,
  tokenB: TokenInfoFormatted,
  fee: number
): Promise<string> => {
  const poolAddress = await liquidityManagerContract.pool(
    getSwapTokenAddress(tokenA),
    getSwapTokenAddress(tokenB),
    fee
  );

  return poolAddress;
};

// get state of pool will be used
// state is a State obj which extends from BaseState
const getPoolState = async (
  poolContracct: ethers.Contract
): Promise<PoolState> => {
  const { currentPoint, liquidity, liquidityX, observationCurrentIndex, observationNextQueueLen, observationQueueLen, sqrtPrice_96 } = await poolContracct.state();

  return {
    sqrtPrice_96: sqrtPrice_96.toString(),
    currentPoint: Number(currentPoint),
    observationCurrentIndex: Number(observationCurrentIndex),
    observationQueueLen: Number(observationQueueLen),
    observationNextQueueLen: Number(observationNextQueueLen),
    liquidity: liquidity.toString(),
    liquidityX: liquidityX.toString()
  };
};

// pointDelta is a number value queried from pool contract
const getPointDelta = async (
  poolContracct: ethers.Contract
): Promise<number> => {
  const pointDelta = Number(await poolContracct.pointDelta());

  return pointDelta;
};

// get token info from token address.
const fetchToken = async (tokenAddr: string, chainId: number, provider: ethers.Wallet): Promise<TokenInfoFormatted> => {
  const tokenContract = new ethers.Contract(tokenAddr, Erc20ABI, provider);

  const name = await tokenContract.name();
  const symbol = await tokenContract.symbol();
  const decimal = await tokenContract.decimals();

  const tokenInfo = {
    name,
    symbol,
    chainId,
    decimal: Number(decimal),
    icon: '/assets/tokens/default.svg',
    custom: true,
    address: tokenAddr
  };

  return tokenInfo;
};

// get token info from token address.
const quoterSwapChainWithExactInput = async (
  quoterContract: ethers.Contract,
  params: QuoterSwapChainWithExactInputParams
): Promise<{outputAmount: string}> => {
  const path = getTokenChainPath(params.tokenChain, params.feeChain);
  const transaction = await quoterContract.swapAmount(params.inputAmount, path);

  return {
    outputAmount: transaction.gasPrice.toString()
  };
};

const quoterSwapChainWithExactOutput = async (
  quoterContract: ethers.Contract,
  params: QuoterSwapChainWithExactOutputParams
): Promise<{inputAmount: string}> => {
  const path = getTokenChainPathReverse(params.tokenChain, params.feeChain);
  const transaction = await quoterContract.swapDesire(params.outputAmount, path);

  return {
    inputAmount: transaction.gasPrice.toString()
  };
};

export {
  fetchToken,
  getPoolAddress,
  getPoolState,
  getPointDelta,
  quoterSwapChainWithExactInput,
  quoterSwapChainWithExactOutput
};

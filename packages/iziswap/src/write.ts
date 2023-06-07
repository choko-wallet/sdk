/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
// Copyright 2021-2023 @choko-wallet/iziswap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as ethers from 'ethers';
import { getTokenChainPath, getTokenChainPathReverse } from 'iziswap-sdk/lib/base';
import { getSwapTokenAddress, isGasOrWrappedGasToken, isGasToken } from 'iziswap-sdk/lib/base/token';
import { BaseChain, buildSendingParams } from 'iziswap-sdk/lib/base/types';
import { MintParam } from 'iziswap-sdk/lib/liquidityManager';
import { SwapChainWithExactInputParams, SwapChainWithExactOutputParams } from 'iziswap-sdk/src/swap/types';

// get contract of mint function
const getMintCall = async (
  // eslint-disable-next-line
  liquidityManagerContract: any,
  account: string,
  chain: BaseChain,
  params: MintParam,
  gasPrice: number | string
// eslint-disable-next-line
): Promise<{mintCalling: any, options: any}> => {
  const deadline = params.deadline ?? '0xffffffff';
  const ifReverse = getSwapTokenAddress(params.tokenA).toLowerCase() > getSwapTokenAddress(params.tokenB).toLowerCase();
  const strictERC20Token = params.strictERC20Token;
  const options = {
    from: account,
    value: '0',
    maxFeePerGas: gasPrice
  };

  if (strictERC20Token === undefined) {
    if (isGasToken(params.tokenA, chain.id)) {
      options.value = params.maxAmountA;
    }

    if (isGasToken(params.tokenB, chain.id)) {
      options.value = params.maxAmountB;
    }
  } else if (!strictERC20Token) {
    if (isGasOrWrappedGasToken(params.tokenA, chain.id)) {
      options.value = params.maxAmountA;
    }

    if (isGasOrWrappedGasToken(params.tokenB, chain.id)) {
      options.value = params.maxAmountB;
    }
  }

  const recipientAddress = params.recipient ?? account;
  const callings = [];
  let mintCalling;

  if (ifReverse) {
    mintCalling = await liquidityManagerContract.mint({
      miner: recipientAddress,
      tokenX: getSwapTokenAddress(params.tokenB),
      tokenY: getSwapTokenAddress(params.tokenA),
      fee: params.fee,
      pl: params.leftPoint,
      pr: params.rightPoint,
      xLim: params.maxAmountB,
      yLim: params.maxAmountA,
      amountXMin: params.minAmountB,
      amountYMin: params.minAmountA,
      deadline
    }, {
      gasLimit: gasPrice
    });
  } else {
    mintCalling = await liquidityManagerContract.mint({
      miner: recipientAddress,
      tokenX: getSwapTokenAddress(params.tokenA),
      tokenY: getSwapTokenAddress(params.tokenB),
      fee: params.fee,
      pl: params.leftPoint,
      pr: params.rightPoint,
      xLim: params.maxAmountA,
      yLim: params.maxAmountB,
      amountXMin: params.minAmountA,
      amountYMin: params.minAmountB,
      deadline
    }, {
      gasLimit: gasPrice
    });
  }

  callings.push(mintCalling);

  if (options.value !== '0') {
    callings.push(await liquidityManagerContract.refundETH());
  }

  if (callings.length === 1) {
    return { mintCalling: callings[0], options: buildSendingParams(chain, options, gasPrice) };
  }

  const multicall: string[] = [];

  for (const c of callings) {
    // eslint-disable-next-line
    multicall.push(c.encodeABI())
  }

  return { mintCalling: multicall, options: buildSendingParams(chain, options, gasPrice) };
};

// get contract of input swap function
const getSwapChainWithExactInputCall = async (
  swapContract: ethers.Contract,
  account: string,
  chain: BaseChain,
  params: SwapChainWithExactInputParams,
  gasPrice: number | string
): Promise<{swapCalling: any, options: any}> => {
  const deadline = params.deadline ?? '0xffffffff';
  const strictERC20Token = params.strictERC20Token ?? false;
  const options = {
    from: account,
    value: '0',
    maxFeePerGas: gasPrice
  };
  const inputToken = params.tokenChain[0];
  const outputToken = params.tokenChain[params.tokenChain.length - 1];
  const path = getTokenChainPath(params.tokenChain, params.feeChain);

  let inputIsChainCoin = false;
  let outputIsChainCoin = false;

  if (strictERC20Token === undefined) {
    inputIsChainCoin = isGasToken(inputToken, chain.id);
    outputIsChainCoin = isGasToken(outputToken, chain.id);
  } else {
    inputIsChainCoin = (!strictERC20Token && isGasOrWrappedGasToken(inputToken, chain.id));
    outputIsChainCoin = (!strictERC20Token && isGasOrWrappedGasToken(outputToken, chain.id));
  }

  if (inputIsChainCoin) {
    options.value = params.inputAmount;
  }

  const finalRecipientAddress = params.recipient ?? account;
  const innerRecipientAddress = outputIsChainCoin ? '0x0000000000000000000000000000000000000000' : finalRecipientAddress;
  const callings = [];

  const swapCalling = await swapContract.swapAmount({
    path,
    recipient: innerRecipientAddress,
    amount: params.inputAmount,
    minAcquired: params.minOutputAmount,
    deadline
  });

  callings.push(swapCalling);

  if (inputIsChainCoin) {
    callings.push(await swapContract.refundETH());
  }

  if (outputIsChainCoin) {
    callings.push(await swapContract.unwrapWETH9('0', finalRecipientAddress));
  }

  if (callings.length === 1) {
    return { swapCalling: callings[0], options: buildSendingParams(chain, options, gasPrice) };
  }

  const multicall: string[] = [];

  for (const c of callings) {
    // eslint-disable-next-line
    multicall.push(c.encodeABI())
  }

  return { swapCalling: await swapContract.multicall(multicall), options: buildSendingParams(chain, options, gasPrice) };
};

// get contract of output swap function
const getSwapChainWithExactOutputCall = async (
  swapContract: ethers.Contract,
  account: string,
  chain: BaseChain,
  params: SwapChainWithExactOutputParams,
  gasPrice: number | string
): Promise<{swapCalling: any, options: any}> => {
  const deadline = params.deadline ?? '0xffffffff';
  const strictERC20Token = params.strictERC20Token ?? false;
  const options = {
    from: account,
    value: '0',
    maxFeePerGas: gasPrice
  };
  const inputToken = params.tokenChain[0];
  const outputToken = params.tokenChain[params.tokenChain.length - 1];
  const path = getTokenChainPathReverse(params.tokenChain, params.feeChain);

  let inputIsChainCoin = false;
  let outputIsChainCoin = false;

  if (strictERC20Token === undefined) {
    inputIsChainCoin = isGasToken(inputToken, chain.id);
    outputIsChainCoin = isGasToken(outputToken, chain.id);
  } else {
    inputIsChainCoin = (!strictERC20Token && isGasOrWrappedGasToken(inputToken, chain.id));
    outputIsChainCoin = (!strictERC20Token && isGasOrWrappedGasToken(outputToken, chain.id));
  }

  if (inputIsChainCoin) {
    options.value = params.maxInputAmount;
  }

  const finalRecipientAddress = params.recipient ?? account;
  const innerRecipientAddress = outputIsChainCoin ? '0x0000000000000000000000000000000000000000' : finalRecipientAddress;
  const callings = [];

  const swapCalling = await swapContract.swapDesire({
    path,
    recipient: innerRecipientAddress,
    desire: params.outputAmount,
    maxPayed: params.maxInputAmount,
    deadline
  });

  callings.push(swapCalling);

  if (inputIsChainCoin) {
    callings.push(await swapContract.refundETH());
  }

  if (outputIsChainCoin) {
    callings.push(await swapContract.unwrapWETH9('0', finalRecipientAddress));
  }

  if (callings.length === 1) {
    return { swapCalling: callings[0], options: buildSendingParams(chain, options, gasPrice) };
  }

  const multicall: string[] = [];

  for (const c of callings) {
    // eslint-disable-next-line
    multicall.push(c.encodeABI())
  }

  return { swapCalling: await swapContract.multicall(multicall), options: buildSendingParams(chain, options, gasPrice) };
};

export { getMintCall, getSwapChainWithExactInputCall, getSwapChainWithExactOutputCall };

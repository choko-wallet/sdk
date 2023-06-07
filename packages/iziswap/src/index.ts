/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
// Copyright 2021-2023 @choko-wallet/iziswap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import * as ethers from 'ethers';
import { pointDeltaRoundingDown, pointDeltaRoundingUp, priceDecimal2Point } from 'iziswap-sdk/lib/base/price';
import { amount2Decimal } from 'iziswap-sdk/lib/base/token/token';
import { initialChainTable, PriceRoundingType } from 'iziswap-sdk/lib/base/types';
import liquidityManagerAbi from 'iziswap-sdk/lib/liquidityManager/abi.json';
import { calciZiLiquidityAmountDesired } from 'iziswap-sdk/lib/liquidityManager/calc';
import { QuoterSwapChainWithExactInputParams, QuoterSwapChainWithExactOutputParams } from 'iziswap-sdk/lib/quoter/types';
import { SwapChainWithExactInputParams, SwapChainWithExactOutputParams } from 'iziswap-sdk/lib/swap/types';
import poolAbi from 'iziswap-sdk/src/pool/poolAbi.json';
import quoterAbi from 'iziswap-sdk/src/quoter/abi.json';
import swapAbi from 'iziswap-sdk/src/swap/abi.json';

import Erc20ABI from './abi/erc20.json';
import { fetchToken, getPointDelta, getPoolAddress, getPoolState, quoterSwapChainWithExactInput, quoterSwapChainWithExactOutput } from './read';
import { getMintCall, getSwapChainWithExactInputCall, getSwapChainWithExactOutputCall } from './write';

const SWAP_DESIRE_ABI = [
  {
    inputs: [
      {
        components: [
          {
            internalType: 'bytes',
            name: 'path',
            type: 'bytes'
          },
          {
            internalType: 'address',
            name: 'recipient',
            type: 'address'
          },
          {
            internalType: 'uint128',
            name: 'desire',
            type: 'uint128'
          },
          {
            internalType: 'uint256',
            name: 'maxPayed',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'deadline',
            type: 'uint256'
          }
        ],
        internalType: 'struct Swap.SwapDesireParams',
        name: 'params',
        type: 'tuple'
      }
    ],
    name: 'swapDesire',
    outputs: [
      {
        internalType: 'uint256',
        name: 'cost',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'acquire',
        type: 'uint256'
      }
    ],
    stateMutability: 'payable',
    type: 'function'
  }
];

async function mint (
  testAAddress: string,
  testBAddress: string,
  privateKey: string,
  rpc: string,
  liquidityManagerAddress: string,
  chainId: number
): Promise<ethers.TransactionResponse | string | void> {
  const chain = initialChainTable[chainId];

  // eslint-disable-next-line
  const provider = new ethers.JsonRpcProvider(rpc, chainId);
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log('address: ', wallet.address);

  const liquidityManagerContract = new ethers.Contract(liquidityManagerAddress, liquidityManagerAbi, wallet);

  const testA = await fetchToken(testAAddress, chainId, wallet);
  const testB = await fetchToken(testBAddress, chainId, wallet);
  const fee = 2000;

  // get pool address of token pair
  const poolAddress = await getPoolAddress(liquidityManagerContract, testA, testB, fee);
  // calling getPoolContract(…) to get pool contract object
  const poolContract = new ethers.Contract(poolAddress, poolAbi, provider);

  // thirdly, query state of pool
  const state = await getPoolState(poolContract);

  // transform decimal price to the point on the pool, the function has following params
  const point1 = priceDecimal2Point(testA, testB, 0.099870, PriceRoundingType.PRICE_ROUNDING_NEAREST);
  const point2 = priceDecimal2Point(testA, testB, 0.29881, PriceRoundingType.PRICE_ROUNDING_NEAREST);

  const pointDelta = await getPointDelta(poolContract);

  const leftPoint = pointDeltaRoundingDown(Math.min(point1, point2), pointDelta);
  const rightPoint = pointDeltaRoundingUp(Math.max(point1, point2), pointDelta);

  const maxTestA = new BigNumber(100).times(10 ** testA.decimal);
  const maxTestB = calciZiLiquidityAmountDesired(leftPoint, rightPoint, state.currentPoint, maxTestA, true, testA, testB);

  const mintParams = {
    // eslint-disable-next-line
    fee,
    leftPoint,
    maxAmountA: maxTestA.toFixed(0),
    maxAmountB: maxTestB.toFixed(0),
    minAmountA: maxTestA.times(0.985).toFixed(0),
    minAmountB: maxTestB.times(0.985).toFixed(0),
    rightPoint,
    tokenA: testA,
    tokenB: testB
  };

  const gasPrice = '50000000';

  // try {
  //   // eslint-disable-next-line
  //   const { mintCalling, options } = await getMintCall(
  //     // eslint-disable-next-line
  //     liquidityManagerContract,
  //     wallet.address,
  //     chain,
  //     mintParams,
  //     gasPrice
  //   );

  //   // eslint-disable-next-line
  //   const gasLimit = await mintCalling.estimateGas(options);

  //   console.log('gas limit: ', gasLimit);

  //   // eslint-disable-next-line
  //   await mintCalling.send({ ...options, gas: gasLimit });

  //   // sign transaction
  //   const signedTx = await wallet.signTransaction(
  //     {
  //       ...options,
  //       // eslint-disable-next-line
  //       to: liquidityManagerAddress,
  //       // eslint-disable-next-line
  //       data: mintCalling.encodeABI(),
  //       // eslint-disable-next-line
  //       gas: new BigNumber(gasLimit * 1.1).toFixed(0, 2)
  //     },
  //   );

  //   if (signedTx) {
  //     const tx = await wallet.sendTransaction({
  //       to: liquidityManagerAddress,
  //       value: gasLimit
  //     });
  //     return tx;
  //   }
  // // eslint-disable-next-line
  // } catch (err: any) {
  //   // eslint-disable-next-line
  //   const errorMsg = err.info.error.message;
  //   return `Something went wrong. ${errorMsg ? errorMsg : ''}`
  // }

  // const node = ethers.namehash('bsc');
  const abiInterface = new ethers.Interface(liquidityManagerAbi);

  const result = abiInterface.encodeFunctionData('mint', [
    {
      miner: wallet.address,
      tokenX: testAAddress,
      tokenY: testBAddress,
      fee: 50000,
      pl: mintParams.leftPoint,
      pr: mintParams.rightPoint,
      xLim: mintParams.maxAmountB,
      yLim: mintParams.maxAmountA,
      amountXMin: mintParams.minAmountB,
      amountYMin: mintParams.minAmountA,
      deadline: '3139838819377368862098500000000000000000'
    }
  ]);

  return result;
}

async function swapInput (
  testAAddress: string,
  testBAddress: string,
  privateKey: string,
  rpc: string,
  chainId: number
): Promise<ethers.TransactionResponse | string | void> {
  const chain = initialChainTable[chainId];

  // eslint-disable-next-line
  const provider = new ethers.JsonRpcProvider(rpc, chainId);
  const wallet = new ethers.Wallet(privateKey, provider);

  // TokenInfoFormatted of token 'testA' and token 'testB'
  const testA = await fetchToken(testAAddress, chainId, wallet);
  const testB = await fetchToken(testBAddress, chainId, wallet);
  const fee = 2000; // 2000 means 0.2%

  const quoterAddress = '0x12a76434182c8cAF7856CE1410cD8abfC5e2639F';

  const quoterContract = new ethers.Contract(quoterAddress, quoterAbi, wallet);

  const amountA = new BigNumber(50).times(10 ** testA.decimal);

  const params = {
    // pay testA to buy testB
    feeChain: [fee],
    inputAmount: amountA.toFixed(0),
    tokenChain: [testA, testB]
  } as QuoterSwapChainWithExactInputParams;

  const { outputAmount } = await quoterSwapChainWithExactInput(quoterContract, params);

  const amountB = outputAmount;
  const amountBDecimal = amount2Decimal(new BigNumber(amountB), testB);

  const swapAddress = '0xBd3bd95529e0784aD973FD14928eEDF3678cfad8';
  const swapContract = new ethers.Contract(swapAddress, swapAbi, wallet);

  const swapParams = {
    ...params,
    // slippery is 1.5%
    minOutputAmount: new BigNumber(amountB).times(0.985).toFixed(0)
  } as SwapChainWithExactInputParams;

  const gasPrice = '50000000';

  const tokenA = testA;
  const tokenB = testB;
  const tokenAContract = new ethers.Contract(
    tokenA.address,
    Erc20ABI,
    wallet
  );
  const tokenBContract = new ethers.Contract(
    tokenB.address,
    Erc20ABI,
    wallet
  );

  // eslint-disable-next-line
  const tokenABalanceBeforeSwap = await tokenAContract.balanceOf(wallet.address);
  // eslint-disable-next-line
  const tokenBBalanceBeforeSwap = await tokenBContract.balanceOf(wallet.address);
  
  // try {
  //   // eslint-disable-next-line
  //   const { options, swapCalling } = getSwapChainWithExactInputCall(
  //     swapContract,
  //     wallet.address,
  //     chain,
  //     swapParams,
  //     gasPrice
  //   );

  //   // eslint-disable-next-line
  //   const gasLimit = await swapCalling.estimateGas(options);

  //   console.log('gas limit: ', gasLimit);

  //   // sign transaction
  //   // options is returned from getSwapChainWithExactInputCall
  //   const signedTx = await wallet.signTransaction(
  //     {
  //       ...options,
  //       to: swapAddress,
  //       // eslint-disable-next-line
  //       data: swapCalling.encodeABI(),
  //       gas: new BigNumber(gasLimit * 1.1).toFixed(0, 2)
  //     },
  //   );

  //   if (signedTx) {
  //     const tx = await wallet.sendTransaction({
  //       to: swapAddress,
  //       value: gasLimit
  //     });
  //     return tx;
  //   }
  // // eslint-disable-next-line
  // } catch (err: any) {
  //   // eslint-disable-next-line
  //   const errorMsg = err.info.error.message;
  //   return `Something went wrong. ${errorMsg ? errorMsg : ''}`
  // }

  // const node = ethers.namehash('bsc');
  const abiInterface = new ethers.Interface(swapAbi);

  const result = abiInterface.encodeFunctionData('swapAmount', [
    {
      path: '0xCFD8A067e1fa03474e79Be646c5f6b6A278473990007D0AD1F11FBB288Cd13819cCB9397E59FAAB4Cdc16F',
      recipient: wallet.address,
      amount: swapParams.inputAmount,
      minAcquired: swapParams.minOutputAmount,
      deadline: '3139838819377368862098500000000000000000'
    }
  ]);

  return result;
}

async function swapOutput (
  testAAddress: string,
  testBAddress: string,
  privateKey: string,
  rpc: string,
  chainId: number
): Promise<ethers.TransactionResponse | string | void> {
  const chain = initialChainTable[chainId];

  // eslint-disable-next-line
  const provider = new ethers.JsonRpcProvider(rpc, chainId);
  const wallet = new ethers.Wallet(privateKey, provider);

  // TokenInfoFormatted of token 'testA' and token 'testB'
  const testA = await fetchToken(testAAddress, chainId, wallet);
  const testB = await fetchToken(testBAddress, chainId, wallet);
  const fee = 2000; // 2000 means 0.2%

  const quoterAddress = '0x12a76434182c8cAF7856CE1410cD8abfC5e2639F';

  const quoterContract = new ethers.Contract(quoterAddress, quoterAbi, wallet);

  const amountB = new BigNumber(50).times(10 ** testA.decimal);

  const params = {
    // pay testA to buy testB
    feeChain: [fee],
    outputAmount: amountB.toFixed(0),
    tokenChain: [testA, testB]
  } as QuoterSwapChainWithExactOutputParams;

  // eslint-disable-next-line
  const { inputAmount } = await quoterSwapChainWithExactOutput(quoterContract, params);

  // eslint-disable-next-line
  const amountA = inputAmount;
  // eslint-disable-next-line
  const amountADecimal = amount2Decimal(new BigNumber(amountA), testA);

  const swapAddress = '0xBd3bd95529e0784aD973FD14928eEDF3678cfad8';
  const swapContract = new ethers.Contract(swapAddress, swapAbi, wallet);

  const swapParams = {
    ...params,
    // slippery is 1.5%, here amountA is value returned from quoter
    maxInputAmount: new BigNumber(amountA).times(1.015).toFixed(0)
  } as SwapChainWithExactOutputParams;

  const gasPrice = '50000000';

  const tokenA = testA;
  const tokenB = testB;
  const tokenAContract = new ethers.Contract(
    tokenA.address,
    Erc20ABI,
    wallet
  );
  const tokenBContract = new ethers.Contract(
    tokenB.address,
    Erc20ABI,
    wallet
  );

  // eslint-disable-next-line
  const tokenABalanceBeforeSwap = await tokenAContract.balanceOf(wallet.address);
  // eslint-disable-next-line
  const tokenBBalanceBeforeSwap = await tokenBContract.balanceOf(wallet.address);
  
  // try {
  //   // eslint-disable-next-line
  //   const { options, swapCalling } = getSwapChainWithExactOutputCall(
  //     swapContract,
  //     wallet.address,
  //     chain,
  //     swapParams,
  //     gasPrice
  //   );

  //   // eslint-disable-next-line
  //   const gasLimit = await swapCalling.estimateGas(options);

  //   console.log('gas limit: ', gasLimit);

  //   // sign transaction
  //   // options is returned from getSwapChainWithExactInputCall
  //   const signedTx = await wallet.signTransaction(
  //     {
  //       ...options,
  //       to: swapAddress,
  //       // eslint-disable-next-line
  //       data: swapCalling.encodeABI(),
  //       gas: new BigNumber(gasLimit * 1.1).toFixed(0, 2)
  //     },
  //   );

  //   if (signedTx) {
  //     const tx = await wallet.sendTransaction({
  //       to: swapAddress,
  //       value: gasLimit
  //     });
  //     return tx;
  //   }
  // // eslint-disable-next-line
  // } catch (err: any) {
  //   // eslint-disable-next-line
  //   const errorMsg = err.info.error.message;
  //   return `Something went wrong. ${errorMsg ? errorMsg : ''}`
  // }

  // const node = ethers.namehash('bsc');
  const abiInterface = new ethers.Interface(SWAP_DESIRE_ABI);

  const result = abiInterface.encodeFunctionData('swapDesire', [
    {
      path: '0xCFD8A067e1fa03474e79Be646c5f6b6A278473990007D0AD1F11FBB288Cd13819cCB9397E59FAAB4Cdc16F',
      recipient: wallet.address,
      desire: swapParams.outputAmount,
      maxPayed: swapParams.maxInputAmount,
      deadline: '3139838819377368862098500000000000000000'
    }
  ]);

  return result;
}

export { mint, swapInput, swapOutput };

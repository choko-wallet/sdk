// Copyright 2021-2022 @choko-wallet/token-price authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Address, PublicClient } from 'viem';

import superagent from 'superagent';

import { loadAbi } from '@choko-wallet/abi';

import { EVM_NATIVE_DECIMAL, nativeAssetData, tokenData } from './tokenData';
import { BalanceInfo } from './types';

export const fetchBalanceInfoByAddress = async (publicClient: PublicClient, address: Address, chainId: number): Promise<BalanceInfo> => {
  // fetch native token coinAndBalance
  const nativeBalance = await publicClient.getBalance({ address });
  const nativeAssetId = nativeAssetData[`${chainId}`];

  const res: BalanceInfo = {
    fungibleTokens: {},
    nativeToken: {
      balance: nativeBalance,
      decimal: BigInt(EVM_NATIVE_DECIMAL),
      name: tokenData[nativeAssetId].name,
      price: 0,
      symbol: tokenData[nativeAssetId].symbol
    }
  };

  // fetch token
  const calls = [];
  const idToQuery = [];

  // first query all token balance
  for (const id in tokenData) {
    const token = tokenData[id];
    const contractAddress = token.contractAddress[`${chainId}`];

    if (contractAddress) {
      idToQuery.push(id);
      calls.push({
        abi: loadAbi('erc20'),
        address: contractAddress,
        functionName: 'name'
      });

      calls.push({
        abi: loadAbi('erc20'),
        address: contractAddress,
        functionName: 'symbol'
      });

      calls.push({
        abi: loadAbi('erc20'),
        address: contractAddress,
        functionName: 'decimals'
      });

      calls.push({
        abi: loadAbi('erc20'),
        address: contractAddress,
        args: [address],
        functionName: 'balanceOf'
      });
    }
  }

  const multicallResult = await publicClient.multicall({
    contracts: calls
  });

  const totalLength = multicallResult.length;
  let offset = 0;
  let index = 0;

  const finalPriceQuery = [];

  while (offset < totalLength) {
    // balance
    const balance = multicallResult[offset + 3].result as bigint;
    const coingeckoId = idToQuery[index];

    if (balance && balance > 0) {
      res.fungibleTokens[coingeckoId] = {
        balance,
        decimal: multicallResult[offset + 2].result as bigint,
        name: multicallResult[offset].result as string,
        price: 0,
        symbol: multicallResult[offset + 1].result as string
      };

      // Ref to 0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2
      if (coingeckoId === 'maker') {
        res.fungibleTokens[coingeckoId].name = 'Maker';
        res.fungibleTokens[coingeckoId].symbol = 'MKR';
      }

      finalPriceQuery.push(idToQuery[index]);
    }

    offset += 4;
    index++;
  }

  const prices = JSON.parse(
    (await superagent
      .get(`https://api.coingecko.com/api/v3/simple/price?ids=${nativeAssetId},${finalPriceQuery.join(',')}&vs_currencies=usd`)
    ).text
  ) as unknown as { [key: string]: { usd: number } };

  for (const priceId in prices) {
    if (priceId === nativeAssetId) {
      res.nativeToken.price = prices[priceId].usd;
    } else {
      res.fungibleTokens[priceId].price = prices[priceId].usd;
    }
  }

  return res;
};

export const getTotalBalanceInUSD = (balanceInfo: BalanceInfo): number => {
  let total = 0;

  for (const id in balanceInfo.fungibleTokens) {
    total += Number(balanceInfo.fungibleTokens[id].balance / 10n ** BigInt(balanceInfo.fungibleTokens[id].decimal)) * balanceInfo.fungibleTokens[id].price;
  }

  total += Number(balanceInfo.nativeToken.balance / 10n ** BigInt(balanceInfo.nativeToken.decimal)) * balanceInfo.nativeToken.price;

  return total;
};

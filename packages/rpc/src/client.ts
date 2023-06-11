// Copyright 2021-2022 @choko-wallet/rpc authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Account, Chain, createPublicClient, createWalletClient, http, PublicClient, WalletClient } from 'viem';
import { bsc, goerli, mainnet, polygon, polygonMumbai } from 'viem/chains';

import { apiKeys } from './env';

const blockPiAPIKeys: {[key: number]: [string, string, Chain]} = {
  1: ['ethereum', apiKeys[1], mainnet],
  5: ['goerli', apiKeys[5], goerli],

  137: ['polygon', apiKeys[137], polygon],
  80001: ['polygon-mumbai', apiKeys[80001], polygonMumbai],

  56: ['bsc', apiKeys[56], bsc]
};

const blockPiRpc = (chainId: number): string => {
  if (Object.hasOwn(blockPiAPIKeys, chainId)) {
    const [network, key] = blockPiAPIKeys[chainId];

    return `https://${network}.blockpi.network/v1/rpc/${key}`;
  } else {
    throw new Error(`Unsupported chainId: ${chainId}`);
  }
};

export const getViemChainConfig = (chainId: number): Chain => {
  if (Object.hasOwn(blockPiAPIKeys, chainId)) {
    return blockPiAPIKeys[chainId][2];
  } else {
    throw new Error(`Unsupported chainId: ${chainId}`);
  }
};

export const getPublicClient = (chainId: number): PublicClient => {
  const rpcEndpoint = blockPiRpc(chainId);

  return createPublicClient({
    chain: getViemChainConfig(chainId),
    batch: {
      multicall: true
    },
    transport: http(rpcEndpoint)
  });
};

export const getWalletClient = (chainId: number): WalletClient => {
  const rpcEndpoint = blockPiRpc(chainId);

  return createWalletClient({
    chain: getViemChainConfig(chainId),
    transport: http(rpcEndpoint)
  });
};

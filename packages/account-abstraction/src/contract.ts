// Copyright 2021-2022 @choko-wallet/account-abstraction authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { JsonRpcProvider } from '@ethersproject/providers';
import { ethers } from 'ethers';

import { encodeContractCall, loadAbi } from '@choko-wallet/abi';

const getSmartWalletAddress = async (
  contractAddress: string,
  provider: JsonRpcProvider,

  owner: string,
  index: number
): Promise<string> => {
  const walletFactoryContract = new ethers.Contract(
    contractAddress, loadAbi('aa-walletFactory'), provider
  );

  /* eslint-disable */
  // @ts-ignore
  return await walletFactoryContract.getAddressForCounterfactualWallet(owner, index);
  /* eslint-enable */
};

const callDataDeployWallet = (
  owner: string,
  entryPoint: string,
  handler: string,
  index: number
) => {
  return encodeContractCall('aa-walletFactory', 'deployCounterFactualWallet', [
    owner, entryPoint, handler, index
  ]);
};

// send tx
// const callDataExecTransaction = (
//   tx: IWalletTransaction,
//   seed: string,
//   batchId?: number
// ) => {

//   const transaction = {
//     to: tx.to,
//     value: tx.value,
//     data: tx.data,

//     operation: tx.operation,
//     targetTxGas: tx.targetTxGas
//   };

//   const refundInfo = {
//     baseGas: tx.baseGas,
//     gasPrice: tx.gasPrice,
//     tokenGasPriceFactor: tx.tokenGasPriceFactor,
//     gasToken: tx.gasToken,
//     refundReceiver: tx.refundReceiver
//   };

//   const rawTx = {
//     to: tx.to,
//     data: tx.data,
//     value: 0,
//     chainId: 5, // TODO: fixme
//   };

// }

export { getSmartWalletAddress };

export { callDataDeployWallet };

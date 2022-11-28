// Copyright 2021-2022 @choko-wallet/account-abstraction authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AddressZero } from '@ethersproject/constants';
import { JsonRpcProvider } from '@ethersproject/providers';
import { ethers, utils, Wallet } from 'ethers';

import { encodeContractCall, loadAbi } from '@choko-wallet/abi';

import { IWalletTransaction } from './types';

/* eslint-disable sort-keys */
const getSmartWalletAddress = async (
  contractAddress: string, // 0xf59cda6fd211303bfb79f87269abd37f565499d8
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
const callDataExecTransaction = async (
  factoryContractAddress: string,
  provider: JsonRpcProvider,

  eoaAddress: string,
  index: number,

  seed: string, // TODO: fixme

  tx: IWalletTransaction,
  batchId: number
) => {
  const w = Wallet.fromMnemonic(seed);
  const wallet = new ethers.Wallet(
    w.privateKey, provider
  );

  const smartWalletAddress = await getSmartWalletAddress(
    factoryContractAddress, provider, eoaAddress, index
  );

  const smartWalletContract = new ethers.Contract(
    smartWalletAddress, loadAbi('aa-wallet'), provider
  );

  const nonce = (await smartWalletContract.getNonce(batchId)) as number;
  const chainId = (await provider.getNetwork()).chainId;

  // validation and fillups
  const transactionWithAllParams: IWalletTransaction = {
    to: tx.to,
    value: tx.value || 0,
    data: tx.data || '0x',

    operation: tx.operation || 0,
    targetTxGas: tx.targetTxGas || 0,
    baseGas: tx.baseGas || 0,
    gasPrice: tx.gasPrice || 0,
    tokenGasPriceFactor: tx.tokenGasPriceFactor || 1,
    gasToken: tx.gasToken || AddressZero,
    refundReceiver: tx.refundReceiver || AddressZero,

    nonce
  };

  const refundInfo = {
    baseGas: transactionWithAllParams.baseGas,
    gasPrice: transactionWithAllParams.gasPrice,
    tokenGasPriceFactor: transactionWithAllParams.tokenGasPriceFactor,
    gasToken: transactionWithAllParams.gasToken,
    refundReceiver: transactionWithAllParams.refundReceiver
  };

  const siganture = await wallet._signTypedData(
    { verifyingContract: smartWalletAddress, chainId: chainId },
    {
      WalletTx: [
        { type: 'address', name: 'to' },
        { type: 'uint256', name: 'value' },
        { type: 'bytes', name: 'data' },
        { type: 'uint8', name: 'operation' },
        { type: 'uint256', name: 'targetTxGas' },
        { type: 'uint256', name: 'baseGas' },
        { type: 'uint256', name: 'gasPrice' },
        { type: 'address', name: 'gasToken' },
        { type: 'address', name: 'refundReceiver' },
        { type: 'uint256', name: 'nonce' }
      ]
    }, transactionWithAllParams
  );

  const execTransactionCalldata = encodeContractCall('aa-wallet', 'execTransaction', [
    {
      to: transactionWithAllParams.to,
      value: transactionWithAllParams.value,
      data: transactionWithAllParams.data,
      operation: transactionWithAllParams.operation,
      targetTxGas: transactionWithAllParams.targetTxGas
    }, batchId, refundInfo, siganture
  ]);

  return execTransactionCalldata;
};

const callDataExecTransactionBatch = (
  transactions: IWalletTransaction[]
) => {
  const encodedTransactions = '0x' + transactions.map((tx) => {
    const data = utils.arrayify(tx.data || '0x');

    return utils.solidityPack(
      ['uint8', 'address', 'uint256', 'uint256', 'bytes'],
      [tx.operation || 0, tx.to, tx.value, data.length, data]
    ).slice(2);
  }).join('');

  console.log(encodedTransactions);

  return encodeContractCall('aa-multisendCallOnly', 'multiSend', [encodedTransactions]);
};

export { getSmartWalletAddress };

export { callDataDeployWallet, callDataExecTransaction, callDataExecTransactionBatch };

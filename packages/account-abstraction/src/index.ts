// Copyright 2021-2022 @choko-wallet/account-abstraction authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { UnsignedTransaction } from 'ethers';

import { AddressZero } from '@ethersproject/constants';
import { JsonRpcProvider } from '@ethersproject/providers';
import { hexToU8a } from '@skyekiwi/util';
import { ethers, utils, Wallet } from 'ethers';
import superagent from 'superagent';

import { encodeContractCall, encodeTransaction, loadAbi } from '@choko-wallet/abi';
import { entropyToMnemonic, UserAccount } from '@choko-wallet/core';

import { biconomyFixtures, biconomyServicesUrl } from './fixtures';
import { BiconomyUserOperation, IWalletTransaction } from './types';
import { getRequestId } from './util';

// import { listenGaslessTxResult } from './listen';

/**
 * Smart Wallet deployment
*/

// get the smart wallet address for an EOA
const getSmartWalletAddress = async (
  provider: JsonRpcProvider, owner: string, index = 0
): Promise<string> => {
  const chainId = await getChainIdFromProvider(provider);
  const walletFactoryContract = new ethers.Contract(
    biconomyFixtures[chainId].walletFactoryAddress,
    loadAbi('aa-walletFactory'),
    provider
  );

  /* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call */
  return await walletFactoryContract.getAddressForCounterfactualWallet(owner, index);
};

// generate call data to deploy a wallet
const callDataDeployWallet = (
  chainId: number,
  eoaAddress: string,
  index = 0
): string => {
  return encodeContractCall('aa-walletFactory', 'deployCounterFactualWallet', [
    eoaAddress, // EOA account
    biconomyFixtures[chainId].entryPointAddress,
    biconomyFixtures[chainId].fallbackHandlerAddress,
    index
  ]);
};

const txEncodedDeployWallet = (
  chainId: number,
  eoaAddress: string,
  extra?: Partial<UnsignedTransaction>,
  index = 0
): string => {
  return encodeTransaction({
    chainId,
    data: callDataDeployWallet(chainId, eoaAddress, index),
    to: biconomyFixtures[chainId].walletFactoryAddress,
    ...extra
  });
};

/**
 * Raw exec transaction
*/

// generate call data to send a tx
const callDataExecTransaction = async (
  provider: JsonRpcProvider,

  smartWalletAddress: string,
  unlockedUserAccount: UserAccount,

  tx: IWalletTransaction,
  batchId = 0
): Promise<string> => {
  const wallet = unlockedUserAccountToEthersJsWallet(unlockedUserAccount, provider);
  const chainId = await getChainIdFromProvider(provider);

  const smartWalletContract = new ethers.Contract(
    smartWalletAddress, loadAbi('aa-wallet'), provider
  );
  const nonce = (await smartWalletContract.getNonce(batchId)) as number;

  /* eslint-disable sort-keys */
  const transactionWithAllParams: IWalletTransaction = {
    to: tx.to,
    value: tx.value || ethers.utils.parseEther('0'),
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

// generate batched tx
const callDataExecTransactionBatch = (
  transactions: IWalletTransaction[]
): string => {
  const encodedTransactions = '0x' + transactions.map((tx) => {
    const data = utils.arrayify(tx.data || '0x00');
    const value = tx.value || tx.value || ethers.utils.parseEther('0');

    return utils.solidityPack(
      ['uint8', 'address', 'uint256', 'uint256', 'bytes'],
      [tx.operation || 0, tx.to, value.toString(), data.length, data]
    ).slice(2);
  }).join('');

  return encodeContractCall('aa-multisend', 'multiSend', [encodedTransactions]);
};

const txEncodedBatchedTransactions = (
  chainId: number,
  transactions: IWalletTransaction[],
  extra?: Partial<UnsignedTransaction>
): string => {
  return encodeTransaction({
    chainId,
    to: biconomyFixtures[chainId].multiSendAddress,
    data: callDataExecTransactionBatch(transactions),
    ...extra
  });
};

/**
 * biconomy gasless tx
 */
const sendBiconomyTxPayload = async (
  provider: JsonRpcProvider,
  op: IWalletTransaction,
  unlockedUserAccount: UserAccount,

  index: number,
  batchId: number,
  isBatchedTx: boolean
): Promise<Uint8Array> => {
  const wallet = unlockedUserAccountToEthersJsWallet(unlockedUserAccount, provider);
  const eoaAddress = unlockedUserAccount.getAddress('ethereum');
  const smartWalletAddress = await getSmartWalletAddress(provider, eoaAddress, index);
  const nonce = await fetchWalletNonce(eoaAddress, index, provider, batchId);
  const chainId = await getChainIdFromProvider(provider);

  const entryPointCallData = encodeContractCall('aa-wallet', 'execFromEntryPoint', [
    op.to, op.value || ethers.utils.parseEther('0'),
    op.data, isBatchedTx ? 1 : 0, 1000000
  ]);

  const userOp: BiconomyUserOperation = {
    sender: smartWalletAddress,
    nonce: nonce,
    initCode: '0x',
    callData: entryPointCallData,

    // TODO: make sense of these fee
    callGasLimit: 2000000,
    verificationGasLimit: 100000,
    preVerificationGas: 21000,
    maxFeePerGas: 61072872608,
    maxPriorityFeePerGas: 1500000000,

    // to be filled
    paymasterAndData: '0x',
    signature: '0x'
  };

  userOp.paymasterAndData = await fetchPaymasterAndData(userOp);

  const hash = getRequestId(userOp, biconomyFixtures[chainId].entryPointAddress, chainId);
  const sig = await wallet.signMessage(utils.arrayify(hash));

  userOp.signature = sig;

  // The below code block is used to send the payload directly
  // const calldata = encodeContractCall('aa-entryPoint', 'handleOps', [[userOp], wallet.address]);
  // const res = await wallet.sendTransaction({
  //   to: '0x119df1582e0dd7334595b8280180f336c959f3bb', // entryPoint
  //   value: 0,
  //   data: calldata,
  //   gasLimit: 2000000
  // })

  const hexifiedUserOp = Object.entries(userOp).map((pair) => {
    if (typeof pair[1] !== 'string' || !pair[1].startsWith('0x')) {
      pair[1] = utils.hexValue(pair[1]);
    }

    return pair;
  }).reduce((s, [k, v]) => ({ ...s, [k]: v }), {});

  const params = [
    hexifiedUserOp, biconomyFixtures[chainId].entryPointAddress, chainId,
    {
      dappAPIKey: 'muxP6qjQy.9b9e49ba-4268-42fe-b5fe-f16de49dc0e9'
    }
  ];

  try {
    const res = await superagent
      .post(biconomyServicesUrl.biconomyRelayService)
      .send({
        method: 'eth_sendUserOperation',
        params: params,
        id: 1234,
        jsonrpc: '2.0'
      });

    /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
    const gaslessTxId = res.body.data.transactionId;

    return hexToU8a(gaslessTxId.slice(2));

    // console.log(res.body.data)
    // const [txHash, blockNumber] = await listenGaslessTxResult(gaslessTxId)
    // return [txHash, blockNumber];
    // return [new Uint8Array(32), 0];
  } catch (e) {
    console.error(e);
    throw new Error('biconomy relayer throws error - AA:sendBiconomyTxPayload');
  }
};

/**
 * Misc helpers
*/
const getChainIdFromProvider = async (provider: JsonRpcProvider): Promise<number> => {
  return (await provider.getNetwork()).chainId;
};

const unlockedUserAccountToEthersJsWallet = (unlockedUserAccount: UserAccount, provider: JsonRpcProvider): ethers.Wallet => {
  if (unlockedUserAccount.isLocked) {
    throw new Error('user account is locked - AA:unlockedUserAccountToEthersJsWallet');
  }

  const w = Wallet.fromMnemonic(entropyToMnemonic(unlockedUserAccount.entropy));

  return new ethers.Wallet(w.privateKey, provider);
};

const fetchWalletNonce = async (eoaAddress: string, index: number, provider: JsonRpcProvider, batchId: number): Promise<number> => {
  const smartWalletAddress = await getSmartWalletAddress(provider, eoaAddress, index);
  const smartWalletContract = new ethers.Contract(smartWalletAddress, loadAbi('aa-wallet'), provider);

  return (await smartWalletContract.getNonce(batchId));
};

const fetchPaymasterAndData = async (userOp: BiconomyUserOperation): Promise<string> => {
  const paymasterData = await superagent
    .post(biconomyServicesUrl.biconomySigningService)
    .set('x-api-key', 'RgL7oGCfN.4faeb81b-87a9-4d21-98c1-c28267ed4428')
    .send({ userOp: userOp });

  if (paymasterData.body.code !== 200) {
    throw new Error('fetching biconomy paymaster data error - AA:fetchPaymasterAndData');
  }

  return paymasterData.body.data.paymasterAndData;
};

export { getSmartWalletAddress };

export { callDataDeployWallet, txEncodedDeployWallet, callDataExecTransaction, callDataExecTransactionBatch, txEncodedBatchedTransactions };

export { sendBiconomyTxPayload };

export { getChainIdFromProvider, unlockedUserAccountToEthersJsWallet, fetchWalletNonce };
// not exported fetchPaymasterAndData

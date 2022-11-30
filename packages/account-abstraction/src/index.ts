// Copyright 2021-2022 @choko-wallet/account-abstraction authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AddressZero } from '@ethersproject/constants';
import { JsonRpcProvider } from '@ethersproject/providers';
import { BigNumberish, ethers, utils, Wallet } from 'ethers';
import { arrayify, hexValue } from 'ethers/lib/utils';
import superagent from 'superagent';

import { encodeContractCall, loadAbi } from '@choko-wallet/abi';

import { BiconomyUserOperation, IWalletTransaction } from './types';
import { getRequestId } from './util';

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

const sendBiconomyBundlerPayload = async (
  provider: JsonRpcProvider,
  op: {
    to: string, data: string, value?: BigNumberish,
  },
  sender: string,
  wallet: ethers.Wallet
) => {
  const entryPointCallData = encodeContractCall('aa-wallet', 'execFromEntryPoint', [
    op.to, op.value || ethers.utils.parseEther('0'), op.data, 0, 1000000
  ]);

  const smartWalletContract = new ethers.Contract(
    sender, loadAbi('aa-wallet'), provider
  );

  const nonce = (await smartWalletContract.getNonce(0)) as number;

  const chainId = (await provider.getNetwork()).chainId;
  const userOp: BiconomyUserOperation = {
    sender: sender,
    nonce: nonce,
    initCode: '0x',
    callData: entryPointCallData,

    callGasLimit: 2000000,
    verificationGasLimit: 100000,
    preVerificationGas: 21000,
    maxFeePerGas: 61072872608,
    maxPriorityFeePerGas: 1500000000,

    paymasterAndData: '0x',
    signature: '0x'
  };

  const paymasterData = await superagent
    .post('https://us-central1-biconomy-staging.cloudfunctions.net/signing-service')
    .set('x-api-key', 'RgL7oGCfN.4faeb81b-87a9-4d21-98c1-c28267ed4428')
    .send({
      userOp: userOp
    });

  userOp.paymasterAndData = paymasterData.body.data.paymasterAndData;

  const hash = getRequestId(userOp, '0x119df1582e0dd7334595b8280180f336c959f3bb', chainId);
  const sig = await wallet.signMessage(arrayify(hash));

  userOp.signature = sig;

  // The below code block is used to send the payload directly
  // const calldata = encodeContractCall('aa-entryPoint', 'handleOps', [[userOp], wallet.address]);
  // const res = await wallet.sendTransaction({
  //   to: '0x119df1582e0dd7334595b8280180f336c959f3bb',
  //   value: 0,
  //   data: calldata,
  //   gasLimit: 2000000
  // })

  const hexifiedUserOp = Object.entries(userOp).map((pair) => {
    if (typeof pair[1] !== 'string' || !pair[1].startsWith('0x')) {
      pair[1] = hexValue(pair[1]);
    }

    return pair;
  }).reduce((s, [k, v]) => ({ ...s, [k]: v }), {});

  const params = [
    hexifiedUserOp, '0x119df1582e0dd7334595b8280180f336c959f3bb', 5, {
      dappAPIKey: 'RgL7oGCfN.4faeb81b-87a9-4d21-98c1-c28267ed4428'
    }];

  console.log(JSON.stringify(params));

  try {
    const res = await superagent
      .post('https://sdk-relayer.prod.biconomy.io/api/v1/relay')
      .send({
        method: 'eth_sendUserOperation',
        params: params,
        id: 1234,
        jsonrpc: '2.0'
      });

    console.log(res.text);
  } catch (e: any) {
    console.log(e);
  }
};

export { getSmartWalletAddress };

export { callDataDeployWallet, callDataExecTransaction, callDataExecTransactionBatch };

export { sendBiconomyBundlerPayload };

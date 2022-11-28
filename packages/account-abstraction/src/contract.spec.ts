// Copyright 2021-2022 @choko-wallet/account-abstraction authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { JsonRpcProvider } from '@ethersproject/providers';
import { ethers, Wallet } from 'ethers';

import { callDataDeployWallet, callDataExecTransaction, callDataExecTransactionBatch, getSmartWalletAddress } from './contract';

const seed = 'humor cook snap sunny ticket distance leaf unusual join business obey below';
const provider = new JsonRpcProvider('https://eth-goerli.g.alchemy.com/v2/70wjS92mV7V63UCiARGJFJW95dJTldV-', 'goerli');
const wallet = new ethers.Wallet(
  Wallet.fromMnemonic(seed).privateKey, provider
);

describe('@choko-wallet/account-abstraction/contract', function () {
  it('generate address & deploy wallet', () => {
    console.log(
      await getSmartWalletAddress(
        '0xf59cda6fd211303bfb79f87269abd37f565499d8',
        provider,

        wallet.address,
        0
      )
    );

    const callData = callDataDeployWallet(
      wallet.address,
      '0x119df1582e0dd7334595b8280180f336c959f3bb', // entryPoint
      '0x0bc0c08122947be919a02f9861d83060d34ea478', // fallback handler
      0
    );

    console.log(callData);

    // const r = await wallet.sendTransaction({
    //   chainId: 5,
    //   to: '0xf59cda6fd211303bfb79f87269abd37f565499d8',
    //   data: callData,
    //   gasLimit: 2000000,
    //   gasPrice: await p.getGasPrice(),
    //   nonce: await p.getTransactionCount(wallet.address),
    // })

    // https://goerli.etherscan.io/tx/0x8a9aba2264b7b9a7e20178d9972c0f2f55f231a8f0bd73610d16b4b3ba7a0cdf

    // console.log(r)
  });

  // it('send transaction - eth transfer - not gasless', async () => {
  //   const smartWalletAddress = await getSmartWalletAddress(
  //     '0xf59cda6fd211303bfb79f87269abd37f565499d8',
  //     provider,

  //     wallet.address,
  //     0
  //   );

  //   // 1. send some tokens to contractWallet
  //   console.log(
  //     await wallet.sendTransaction({
  //       to: smartWalletAddress,
  //       value: ethers.utils.parseEther("0.2")
  //     })
  //   )

  //   const callData = callDataExecTransaction(
  //     '0xf59cda6fd211303bfb79f87269abd37f565499d8', provider,

  //     wallet.address, 0,

  //     seed,

  //     {
  //       to: '0xAA1658296e2b770fB793eb8B36E856c8210A566F',
  //       value: ethers.utils.parseEther('0.01'),
  //       data: '0x',
  //     },
  //     0
  //   )

  //   const res = await wallet.sendTransaction({
  //     to: smartWalletAddress,
  //     data: callData,
  //     value: 0,
  //     chainId: 5
  //   });

  //   console.log(res)
  // });

  // it('send transaction - eth transfer - not gasless', async () => {
  //   const smartWalletAddress = await getSmartWalletAddress(
  //     '0xf59cda6fd211303bfb79f87269abd37f565499d8',
  //     provider,

  //     wallet.address,
  //     0
  //   );

  //   // 1. send some tokens to contractWallet
  //   console.log(
  //     await wallet.sendTransaction({
  //       to: '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844',
  // value: 0,
  // data: encodeContractCall(
  //   'erc20', 'transfer', [ smartWalletAddress, (10 * Math.pow(10, 18)).toString() ]
  // )
  //     })
  //   )

  //   const callData = callDataExecTransaction(
  //     '0xf59cda6fd211303bfb79f87269abd37f565499d8', provider,

  //     wallet.address, 0,

  //     seed,

  //     {
  //       to: '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844',
  //       value: 0,
  //       data: encodeContractCall(
  //         'erc20', 'transfer', [ wallet.address, (10 * Math.pow(10, 18)).toString() ]
  //       ),
  //     },
  //     0
  //   )

  //   const res = await wallet.sendTransaction({
  //     to: smartWalletAddress,
  //     data: callData,
  //     value: 0,
  //     chainId: 5
  //   });

  //   console.log(res)
  // });

  // it('send transaction - batched - not gasless', async () => {
  //   const smartWalletAddress = await getSmartWalletAddress(
  //     '0xf59cda6fd211303bfb79f87269abd37f565499d8',
  //     provider,

  //     wallet.address,
  //     0
  //   );

  //   // https://goerli.etherscan.io/tx/0x0767f46e39b7492ddf19c31e91ef41eba8fa41d0abd883fe3533f94de3073ef1
  //   const callData = callDataExecTransaction(
  //     '0xf59cda6fd211303bfb79f87269abd37f565499d8', provider,

  //     wallet.address, 0,

  //     seed,

  //     {
  //       to: '0x2f65bed438a30827d408b7c6818ec5a22c022dd1', // multisend addr
  //       value: 0,
  //       gasPrice: (await provider.getGasPrice()).toString(),
  //       targetTxGas: (ethers.constants.Two.pow(24)).toString(),
  //       data: callDataExecTransactionBatch([
  //         {
  //           to: wallet.address,
  //           value: ethers.utils.parseEther("0.001"),
  //         }
  //         // {
  //         //   to: '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844',
  //         //   value: 0,
  //         //   data: encodeContractCall(
  //         //     'erc20', 'transfer', [ smartWalletAddress, (1 * Math.pow(10, 18)).toString() ]
  //         //   )
  //         // },
  //         // {
  //         //   to: '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844',
  //         //   value: 0,
  //         //   data: encodeContractCall(
  //         //     'erc20', 'transfer', [ smartWalletAddress, (2 * Math.pow(10, 18)).toString() ]
  //         //   )
  //         // },
  //         // {
  //         //   to: '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844',
  //         //   value: 0,
  //         //   data: encodeContractCall(
  //         //     'erc20', 'transfer', [ smartWalletAddress, (3 * Math.pow(10, 18)).toString() ]
  //         //   )
  //         // }
  //       ]),
  //     },
  //     0
  //   )

  //   const res = await wallet.sendTransaction({
  //     to: smartWalletAddress,
  //     data: callData,
  //     value: 0,
  //     chainId: 5,
  //     gasLimit: 20000000,
  //   });

  //   console.log(res)
  // });
});

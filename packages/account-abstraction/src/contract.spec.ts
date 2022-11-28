// Copyright 2021-2022 @choko-wallet/account-abstraction authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { JsonRpcProvider } from '@ethersproject/providers';
import { ethers, Wallet } from 'ethers';

import { callDataDeployWallet, getSmartWalletAddress } from './contract';

const provider = 'https://eth-goerli.g.alchemy.com/v2/70wjS92mV7V63UCiARGJFJW95dJTldV-';
const seed = 'humor cook snap sunny ticket distance leaf unusual join business obey below';

describe('@choko-wallet/account-abstraction/contract', function () {
  it('generate address & deploy wallet', async () => {
    const p = new JsonRpcProvider(provider, 'goerli');
    const w = Wallet.fromMnemonic(seed);

    const wallet = new ethers.Wallet(
      w.privateKey, p
    );

    console.log(wallet.address);

    console.log(
      await getSmartWalletAddress(
        '0xf59cda6fd211303bfb79f87269abd37f565499d8',
        p,

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
});

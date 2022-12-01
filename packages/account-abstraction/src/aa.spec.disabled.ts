// Copyright 2021-2022 @choko-wallet/account-abstraction authors & contributors
// SPDX-License-Identifier: Apache-2.0

// describe('@choko-wallet/account-abstraction/contract', function () {
//   it('place holder', () => {
//     console.log('test');
//   });
// });

import { JsonRpcProvider } from '@ethersproject/providers';
import { sleep } from '@skyekiwi/util';
import { ethers } from 'ethers';

import { decodeTransaction, encodeContractCall } from '@choko-wallet/abi';
import { AccountOption, UserAccount } from '@choko-wallet/core';

import { callDataExecTransaction, getSmartWalletAddress, sendBiconomyTxPayload, txEncodedBatchedTransactions, txEncodedDeployWallet, unlockedUserAccountToEthersJsWallet } from '.';

const seed = 'humor cook snap sunny ticket distance leaf unusual join business obey below';
const provider = new JsonRpcProvider('https://eth-goerli.g.alchemy.com/v2/70wjS92mV7V63UCiARGJFJW95dJTldV-', 'goerli');
const userAccount = new UserAccount(new AccountOption({
  hasEncryptedPrivateKeyExported: false,
  localKeyEncryptionStrategy: 0
}));

describe('@choko-wallet/account-abstraction/contract', function () {
  it('place holder', () => {
    console.log('test');
  });

  it('generate address & deploy wallet', async () => {
    userAccount.unlock(seed);
    await userAccount.init();

    const smartWalletAddress = await getSmartWalletAddress(
      provider, userAccount.getAddress('ethereum'), 0
    );

    console.log('smartWalletAddress is', smartWalletAddress);

    const wallet = unlockedUserAccountToEthersJsWallet(userAccount, provider);
    const r = await wallet.sendTransaction(decodeTransaction(txEncodedDeployWallet(
      5, userAccount.getAddress('ethereum'), {
        gasLimit: 2000000
      }
    )));

    await r.wait();
    console.log(r);
  });

  it('send transaction - eth transfer - not gasless', async () => {
    userAccount.unlock(seed);
    await userAccount.init();
    const wallet = unlockedUserAccountToEthersJsWallet(userAccount, provider);
    const smartWalletAddress = await getSmartWalletAddress(provider, wallet.address);

    // 1. send some tokens to contractWallet
    const transfer = await wallet.sendTransaction({
      to: smartWalletAddress,
      value: ethers.utils.parseEther('0.00001')
    });

    await transfer.wait();

    const callData = callDataExecTransaction(
      provider, smartWalletAddress, userAccount,
      {
        data: '0x',
        to: '0xAA1658296e2b770fB793eb8B36E856c8210A566F',
        value: ethers.utils.parseEther('0.01')
      },
      0
    );

    const res = await wallet.sendTransaction({
      chainId: 5,
      data: callData,
      to: smartWalletAddress,
      value: 0
    });

    await res.wait();
    console.log(res);
  });

  it('send transaction - contract call - not gasless', async () => {
    userAccount.unlock(seed);
    await userAccount.init();
    const wallet = unlockedUserAccountToEthersJsWallet(userAccount, provider);
    const smartWalletAddress = await getSmartWalletAddress(provider, wallet.address, 0);

    // const transfer = await wallet.sendTransaction({
    //   to: '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844', // DAI address
    //   value: 0,
    //   data: encodeContractCall(
    //     'erc20', 'transfer', [ smartWalletAddress, (10 * Math.pow(10, 18)).toString() ]
    //   )
    // });

    // await transfer.wait();

    const callData = callDataExecTransaction(
      provider,

      smartWalletAddress,

      userAccount,

      {
        data: encodeContractCall(
          'erc20', 'transfer', [wallet.address, (9 * Math.pow(10, 18)).toString()]
        ),
        to: '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844', // DAI
        value: 0
      },
      0
    );

    const res = await wallet.sendTransaction({
      chainId: 5,
      data: callData,
      to: smartWalletAddress,
      value: 0
    });

    console.log(res);
  });

  it('send transaction - batched - not gasless', async () => {
    userAccount.unlock(seed);
    await userAccount.init();
    const wallet = unlockedUserAccountToEthersJsWallet(userAccount, provider);
    const smartWalletAddress = await getSmartWalletAddress(provider, wallet.address, 0);

    const tx = ethers.utils.parseTransaction(
      txEncodedBatchedTransactions(5, [
        {
          to: wallet.address,
          value: ethers.utils.parseEther('0.001').toString()
        },
        {
          data: encodeContractCall(
            'erc20', 'transfer', [smartWalletAddress, (1 * Math.pow(10, 18)).toString()]
          ),
          to: '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844'
        },
        {
          data: encodeContractCall(
            'erc20', 'transfer', [smartWalletAddress, (2 * Math.pow(10, 18)).toString()]
          ),
          to: '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844'
        },
        {
          data: encodeContractCall(
            'erc20', 'transfer', [smartWalletAddress, (3 * Math.pow(10, 18)).toString()]
          ),
          to: '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844'
        }
      ], {
        gasLimit: 2000000
      })
    );
    const res = await wallet.sendTransaction(tx);

    await res.wait();

    console.log(res);
  });

  it('send transaction - gasless', async () => {
    userAccount.unlock(seed);
    await userAccount.init();

    const result = await sendBiconomyTxPayload(
      provider,
      {
        data: encodeContractCall('erc20', 'transfer', ['0xAA1658296e2b770fB793eb8B36E856c8210A566F', 100000]),
        to: '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844', // DAI
        value: 0
      },

      userAccount, 0, 0, false
    );

    await sleep(20000);
    console.log(result);
  });

  it('send transaction - gasless', async () => {
    userAccount.unlock(seed);
    await userAccount.init();
    const wallet = unlockedUserAccountToEthersJsWallet(userAccount, provider);
    const smartWalletAddress = await getSmartWalletAddress(provider, wallet.address, 0);

    const tx = decodeTransaction(
      txEncodedBatchedTransactions(5, [
        {
          to: wallet.address,
          value: ethers.utils.parseEther('0.001').toString()
        },
        {
          data: encodeContractCall(
            'erc20', 'transfer', [smartWalletAddress, (1 * Math.pow(10, 18)).toString()]
          ),
          to: '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844'
        },
        {
          data: encodeContractCall(
            'erc20', 'transfer', [smartWalletAddress, (2 * Math.pow(10, 18)).toString()]
          ),
          to: '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844'
        },
        {
          data: encodeContractCall(
            'erc20', 'transfer', [smartWalletAddress, (3 * Math.pow(10, 18)).toString()]
          ),
          to: '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844'
        }
      ], {
        gasLimit: 2000000
      })
    );
    const result = await sendBiconomyTxPayload(
      provider,
      {
        data: tx.data,
        to: tx.to
      },
      userAccount, 0, 0, true
    );

    await sleep(20000);
    console.log(result);
  });
});

// Copyright 2021-2022 @choko-wallet/account-abstraction authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { sleep } from '@skyekiwi/util';
import { ethers } from 'ethers';

import { decodeTransaction, encodeContractCall } from '@choko-wallet/abi';
import { AccountOption, chainIdToProvider, defaultAccountOption, UserAccount } from '@choko-wallet/core';
import { Signer } from '@choko-wallet/core/signer';

import { callDataExecTransaction, deployAAContractIfNeeded, getSmartWalletAddress, isSmartWalletDeployed, sendBiconomyTxPayload, txEncodedBatchedTransactions, txEncodedDeployWallet, unlockedUserAccountToEthersJsWallet } from '.';

const seed = 'humor cook snap sunny ticket distance leaf unusual join business obey below';
const anotherSeed = 'love cover fruit amateur only disorder exhibit injury resist jeans dinner that';
const provider = chainIdToProvider[5];

const userAccount = new UserAccount(new AccountOption(defaultAccountOption));

describe('@choko-wallet/account-abstraction/contract', function () {
  it('place holder', () => {
    console.log('test');
  });

  it('correct tell if AA is deployed', async () => {
    userAccount.unlock(anotherSeed);
    await userAccount.init();

    const signer = new Signer(userAccount);

    await deployAAContractIfNeeded(5, signer);
    console.log(userAccount.getAddress('ethereum'), userAccount.aaWalletAddress);
    console.log(await isSmartWalletDeployed(5, userAccount.getAddress('ethereum')));
  });

  it('transfer assets before an account is deployed', async () => {
    userAccount.unlock('glimpse choose valley wasp board amateur eight exhaust child hand verify true');
    await userAccount.init();
    const signer = new Signer(userAccount);

    await deployAAContractIfNeeded(5, signer);

    // const aaWalletAddr = userAccount.aaWalletAddress;
    // userAccount.unlock(seed);
    // await userAccount.init();

    // const wallet = unlockedUserAccountToEthersJsWallet(userAccount, chainIdToProvider[5]);
    // const tx = await wallet.sendTransaction({
    //   to: aaWalletAddr,
    //   value: ethers.utils.parseEther('0.001'),
    // });

    // console.log(tx)
  });
  it('generate address & deploy wallet', async () => {
    userAccount.unlock(seed);
    await userAccount.init();

    const smartWalletAddress = await getSmartWalletAddress(
      chainIdToProvider[5], userAccount.getAddress('ethereum'), 0
    );

    console.log('smartWalletAddress is', smartWalletAddress);

    const wallet = unlockedUserAccountToEthersJsWallet(userAccount, chainIdToProvider[5]);
    const r = await wallet.sendTransaction(decodeTransaction(txEncodedDeployWallet(
      5, userAccount.getAddress('ethereum'), {
        gasLimit: '2000000'
      }
    )));

    await r.wait();
    console.log(r);
  });

  it('send transaction - contract call - not gasless', async () => {
    userAccount.unlock(seed);
    await userAccount.init();
    const signer = new Signer(userAccount);
    const smartWalletAddress = await getSmartWalletAddress(provider, signer.getEthereumAddress(), 0);

    // const transfer = await wallet.sendTransaction({
    //   to: '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844', // DAI address
    //   value: 0,
    //   data: encodeContractCall(
    //     'erc20', 'transfer', [ smartWalletAddress, (10 * Math.pow(10, 18)).toString() ]
    //   )
    // });

    // await transfer.wait();
    const callData = await callDataExecTransaction(
      provider,

      smartWalletAddress,

      signer,

      {
        data: encodeContractCall(
          'erc20', 'transfer', [signer.getEthereumAddress(), (9 * Math.pow(10, 18)).toString()]
        ),
        to: '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844' // DAI
      },
      0
    );

    const res = await signer.sendTransaction({
      data: callData,
      to: smartWalletAddress,
      value: 0
    }, 5);

    console.log(res);
  });

  it('send transaction - batched - not gasless', async () => {
    userAccount.unlock(seed);
    await userAccount.init();
    const signer = new Signer(userAccount);
    const smartWalletAddress = await getSmartWalletAddress(provider, signer.getEthereumAddress(), 0);

    const tx = ethers.utils.parseTransaction(
      txEncodedBatchedTransactions(5, [
        {
          to: signer.getEthereumAddress(),
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

    const res = await signer.sendTransaction({
      data: tx.data,
      to: tx.to,
      value: tx.value.toString()
    }, 5);

    console.log(res);
  });

  it('send transaction - gasless', async () => {
    userAccount.unlock(seed);
    await userAccount.init();
    const signer = new Signer(userAccount);

    const result = await sendBiconomyTxPayload(
      provider,
      {
        data: encodeContractCall('erc20', 'transfer', ['0xAA1658296e2b770fB793eb8B36E856c8210A566F', 100000]),
        to: '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844', // DAI
        value: 0
      },

      signer, false
    );

    await sleep(20000);
    console.log(result);
  });

  it('send transaction - gasless', async () => {
    userAccount.unlock(seed);
    await userAccount.init();
    const signer = new Signer(userAccount);

    const smartWalletAddress = await getSmartWalletAddress(provider, signer.getEthereumAddress(), 0);

    const tx = decodeTransaction(
      txEncodedBatchedTransactions(5, [
        {
          to: signer.getEthereumAddress(),
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
      signer, true
    );

    await sleep(20000);
    console.log(result);
  });
});

// Copyright 2021-2022 @choko-wallet/request-handler authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { hexToU8a, u8aToHex } from '@skyekiwi/util';
import { ethers } from 'ethers';

import { encodeContractCall } from '@choko-wallet/abi';
import { callDataExecTransactionBatch } from '@choko-wallet/account-abstraction';
import { biconomyFixtures } from '@choko-wallet/account-abstraction/fixtures';
import { AccountOption, DappDescriptor, UserAccount } from '@choko-wallet/core';
import { SignTxType } from '@choko-wallet/core/types';
import { xxHash } from '@choko-wallet/core/util';
import { knownNetworks } from '@choko-wallet/known-networks';

import { SignTxDescriptor, SignTxRequest, SignTxRequestPayload } from '../signTx';

const seed = 'xx';// 'humor cook snap sunny ticket distance leaf unusual join business obey below';
const daiContractAddress = '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844';
const contractAddress = '0x238F47e33cD44A7701F2Bb824659D432efD17b41';

describe('@choko-wallet/request-handler - eth - aaTx', function () {
  const dapp = new DappDescriptor({
    activeNetwork: knownNetworks[u8aToHex(xxHash('goerli'))],
    displayName: 'Jest Testing',
    infoName: 'Test',
    version: 0
  });
  const account = new UserAccount(new AccountOption({
    hasEncryptedPrivateKeyExported: false,
    localKeyEncryptionStrategy: 0
  }));

  it('e2e - signTx - ethereum AA contract call', async () => {
    account.unlock(seed);
    await account.init();
    account.lock();

    const data = encodeContractCall(
      'test', 'store', [12345]
    );

    /*
       function store(uint256 num) public {
           number = num;
       }
       call store method with 12345 parameter...
      */

    const tx = {
      chainId: 5,
      data: data,
      to: contractAddress,
      gasLimit: 200000
    };

    const serializedTx = ethers.utils.serializeTransaction(tx);
    const request = new SignTxRequest({
      dappOrigin: dapp,
      payload: new SignTxRequestPayload({
        encoded: hexToU8a(serializedTx.slice(2)),
        signTxType: SignTxType.AACall
      }),
      userOrigin: account
    });

    const signTx = new SignTxDescriptor();

    account.unlock(seed);
    await account.init();
    const response = await signTx.requestHandler(request, account);

    console.log('response: ', response);
  });

  it('e2e - signTx - ethereum AA call batch', async () => {
    account.unlock(seed);
    await account.init();
    account.lock();

    const innerCall = {
      data: callDataExecTransactionBatch([{
        to: daiContractAddress,
        data: encodeContractCall('erc20', 'transfer', [
          account.aaWalletAddress, 10000000000000
        ])
      }, {
        to: daiContractAddress,
        data: encodeContractCall('erc20', 'transfer', [
          account.aaWalletAddress, 20000000000000
        ])
      }, {
        to: daiContractAddress,
        data: encodeContractCall('erc20', 'transfer', [
          account.aaWalletAddress, 30000000000000
        ])
      }]),
      to: biconomyFixtures[5].multiSendAddress,
      gasLimit: 2000000
    };

    const serializedTx = ethers.utils.serializeTransaction(innerCall);
    const request = new SignTxRequest({
      dappOrigin: dapp,
      payload: new SignTxRequestPayload({
        encoded: hexToU8a(serializedTx.slice(2)),
        signTxType: SignTxType.AACallBatch
      }),
      userOrigin: account
    });

    const signTx = new SignTxDescriptor();

    account.unlock(seed);
    await account.init();
    const response = await signTx.requestHandler(request, account);

    console.log('response: ', response);
  });

  it('e2e - signTx - no gasLimit AA call should fail', async () => {
    account.unlock(seed);
    await account.init();
    account.lock();

    const data = encodeContractCall(
      'test', 'store', [12345]
    );

    /*
       function store(uint256 num) public {
           number = num;
       }
       call store method with 12345 parameter...
      */

    const tx = {
      chainId: 5,
      data: data,
      to: contractAddress
    };

    const serializedTx = ethers.utils.serializeTransaction(tx);
    const request = new SignTxRequest({
      dappOrigin: dapp,
      payload: new SignTxRequestPayload({
        encoded: hexToU8a(serializedTx.slice(2)),
        signTxType: SignTxType.AACall
      }),
      userOrigin: account
    });

    const signTx = new SignTxDescriptor();

    account.unlock(seed);
    await account.init();

    try {
      const response = await signTx.requestHandler(request, account);

      console.log('response: ', response);
    } catch (e) {
      console.log(e);
    }
  });
});

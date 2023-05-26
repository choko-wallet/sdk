// Copyright 2021-2022 @choko-wallet/request-handler authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { encodeContractCall } from '@choko-wallet/abi';
import { txEncodedBatchedTransactions } from '@choko-wallet/account-abstraction';
import { DappDescriptor, defaultAccountOption, UserAccount } from '@choko-wallet/core';
import { SignTxType } from '@choko-wallet/core/types';
import { xxHash } from '@choko-wallet/core/util';
import { knownNetworks } from '@choko-wallet/known-networks';
import { ethers } from 'ethers';

import { hexToU8a, u8aToHex } from '@skyekiwi/util';

import { SignTxDescriptor, SignTxRequest, SignTxRequestPayload } from '../signTx';

const seed = 'humor cook snap sunny ticket distance leaf unusual join business obey below';
const daiContractAddress = '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844';

// This test is disabled becuase Goerli faucet is off and the account is low on balance!
// We should enable this test again when Goerli Faucet is back to normal

describe('@choko-wallet/request-handler - eth - gasless', function () {
  const dapp = new DappDescriptor({
    activeNetwork: knownNetworks[u8aToHex(xxHash('goerli'))],
    displayName: 'Jest Testing',
    infoName: 'Test',
    version: 0
  });

  const option = defaultAccountOption;
  const account = new UserAccount(option);

  it('e2e - signTx - ethereum gasless contract call', async () => {
    account.unlock(seed);
    await account.init();
    account.lock();

    const serializedTx = ethers.utils.serializeTransaction({
      data: encodeContractCall('erc20', 'transfer', [
        account.getAddress('ethereum'), 1230000000000000
      ]),
      to: daiContractAddress
    });

    const request = new SignTxRequest({
      dappOrigin: dapp,
      payload: new SignTxRequestPayload({
        encoded: hexToU8a(serializedTx.slice(2)),
        signTxType: SignTxType.Gasless
      }),
      userOrigin: account
    });

    const signTx = new SignTxDescriptor();

    account.unlock(seed);
    await account.init();
    const response = await signTx.requestHandler(request, account);

    console.log('response: ', response);
  });

  it('e2e - signTx - ethereum gasless contract call - batch', async () => {
    account.unlock(seed);
    await account.init();
    account.lock();

    const serializedTx = txEncodedBatchedTransactions(5, [{
      data: encodeContractCall('erc20', 'transfer', [
        account.aaWalletAddress, 10000000000000
      ]),
      to: daiContractAddress
    }, {
      data: encodeContractCall('erc20', 'transfer', [
        account.aaWalletAddress, 20000000000000
      ]),
      to: daiContractAddress
    }, {
      data: encodeContractCall('erc20', 'transfer', [
        account.aaWalletAddress, 30000000000000
      ]),
      to: daiContractAddress
    }], {
      gasLimit: 2000000
    }
    );

    const request = new SignTxRequest({
      dappOrigin: dapp,
      payload: new SignTxRequestPayload({
        encoded: hexToU8a(serializedTx.slice(2)),
        signTxType: SignTxType.GaslessBatch
      }),
      userOrigin: account
    });

    const signTx = new SignTxDescriptor();

    account.unlock(seed);
    await account.init();
    const response = await signTx.requestHandler(request, account);

    console.log('response: ', response);
  });
});

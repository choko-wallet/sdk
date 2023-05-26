// Copyright 2021-2022 @choko-wallet/request-handler authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { hexToU8a, u8aToHex } from '@skyekiwi/util';
import { ethers } from 'ethers';

import { encodeContractCall } from '@choko-wallet/abi';
import { txEncodedBatchedTransactions } from '@choko-wallet/account-abstraction';
import { DappDescriptor, defaultAccountOption, UserAccount } from '@choko-wallet/core';
import { SignTxType } from '@choko-wallet/core/types';
import { xxHash } from '@choko-wallet/core/util';
import { knownNetworks } from '@choko-wallet/known-networks';

import { SignTxDescriptor, SignTxRequest, SignTxRequestPayload } from '../signTx';

const seed = 'humor cook snap sunny ticket distance leaf unusual join business obey below';
const daiContractAddress = '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844';

const option = defaultAccountOption;

describe('@choko-wallet/request-handler - eth - aaTx', function () {
  const dapp = new DappDescriptor({
    activeNetwork: knownNetworks[u8aToHex(xxHash('goerli'))],
    displayName: 'Jest Testing',
    infoName: 'Test',
    version: 0
  });
  const account = new UserAccount(option);

  it('e2e - signTx - ethereum AA contract call', async () => {
    account.unlock(seed);
    await account.init();
    account.lock();

    const serializedTx = ethers.utils.serializeTransaction({
      data: encodeContractCall(
        'erc20', 'transfer', [
          account.getAddress('ethereum'), 1000000000
        ]
      ),
      gasLimit: 200000,
      to: daiContractAddress
    });

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
});

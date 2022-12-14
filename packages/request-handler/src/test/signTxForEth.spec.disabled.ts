// Copyright 2021-2022 @choko-wallet/request-handler authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { hexToU8a, u8aToHex } from '@skyekiwi/util';
import { ethers } from 'ethers';

import { encodeContractCall } from '@choko-wallet/abi';
import { AccountOption, DappDescriptor, UserAccount } from '@choko-wallet/core';
import { SignTxType } from '@choko-wallet/core/types';
import { xxHash } from '@choko-wallet/core/util';
import { knownNetworks } from '@choko-wallet/known-networks';

import { SignTxDescriptor, SignTxRequest, SignTxRequestPayload } from '../signTx';

const seed = 'humor cook snap sunny ticket distance leaf unusual join business obey below';
const contractAddress = '0x238F47e33cD44A7701F2Bb824659D432efD17b41';

// This test is disabled becuase Goerli faucet is off and the account is low on balance!
// We should enable this test again when Goerli Faucet is back to normal

describe('@choko-wallet/request-handler-eth - signTx', function () {
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

  it('e2e - signTx - ethereum', async () => {
    account.unlock(seed);
    await account.init();
    account.lock();

    const serializedTx = ethers.utils.serializeTransaction({
      to: '0xE8DAC12f7A4b0a47e8e2Af2b96db6F54e2E2C9C3',
      value: ethers.utils.parseEther('0')
    });
    const request = new SignTxRequest({
      dappOrigin: dapp,
      payload: new SignTxRequestPayload({
        encoded: hexToU8a(serializedTx.slice(2)),
        signTxType: SignTxType.Ordinary
      }),
      userOrigin: account
    });

    const serialized = request.serialize();
    const deserialized = SignTxRequest.deserialize(serialized);

    console.log('deserailized.userOrigin: ', deserialized);

    const signTx = new SignTxDescriptor();

    account.unlock(seed);
    await account.init();
    const response = await signTx.requestHandler(request, account);

    console.log('response: ', response);
  });

  it('e2e - signTx - ethereum contract call', async () => {
    account.unlock(seed);
    await account.init();
    account.lock();

    const serializedTx = ethers.utils.serializeTransaction({
      data: encodeContractCall(
        'test', 'store', [12345]
      ),
      to: contractAddress
    });

    const request = new SignTxRequest({
      dappOrigin: dapp,
      payload: new SignTxRequestPayload({
        encoded: hexToU8a(serializedTx.slice(2)),
        signTxType: SignTxType.Ordinary
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

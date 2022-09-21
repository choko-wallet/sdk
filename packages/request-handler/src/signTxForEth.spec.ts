// Copyright 2021-2022 @choko-wallet/request-handler authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { hexToU8a, u8aToHex } from '@skyekiwi/util';
import { ethers } from 'ethers';

import { UserAccount } from '@choko-wallet/core';
import { DappDescriptor } from '@choko-wallet/core/dapp';
import { xxHash } from '@choko-wallet/core/util';
import { knownNetworks } from '@choko-wallet/known-networks';

import { SignTxDescriptor, SignTxRequest, SignTxRequestPayload } from './signTx';

const privateKey = '6e00e2fb6feb95393f29e0ceeabebc4f7b2d692b4912663546755b9b8f87b938';
const seed = 'acoustic hover lyrics object execute unfold father give wing hen remain ship';

describe('@choko-wallet/request-handler-eth - signTx', function () {
  afterAll(() => {
    console.log('shutdown WebSocket connector!');
  });

  it('e2e - signTx - ethereum', async () => {
    const dapp = new DappDescriptor({
      activeNetwork: knownNetworks[u8aToHex(xxHash('rinkeby'))],
      displayName: 'Jest Testing',
      infoName: 'Test',
      version: 0
    });

    const account = new UserAccount({
      hasEncryptedPrivateKeyExported: false,
      keyType: 'ethereum',
      localKeyEncryptionStrategy: 0
    });
    const mnemonicWallet = ethers.Wallet.fromMnemonic(seed);

    expect((mnemonicWallet.privateKey).slice(2)).toEqual(privateKey);

    account.unlock(hexToU8a((mnemonicWallet.privateKey).slice(2)));
    await account.init();
    account.lock();

    const tx = {
      chainId: 4,
      to: '0xE8DAC12f7A4b0a47e8e2Af2b96db6F54e2E2C9C3',
      value: ethers.utils.parseEther('0.01')
    };

    const serializedTx = ethers.utils.serializeTransaction(tx);
    const request = new SignTxRequest({
      dappOrigin: dapp,
      payload: new SignTxRequestPayload({
        encoded: hexToU8a(serializedTx.slice(2))
      }),
      userOrigin: account
    });

    const serialized = request.serialize();
    const deserialized = SignTxRequest.deserialize(serialized);

    console.log('account: ', account);
    console.log('deserailized.userOrigin: ', deserialized.userOrigin);

    // expect(deserialized.payload.encoded).toEqual(hexToU8a(serializedTx.slice(2)));
    // expect(deserialized.dappOrigin).toEqual(dapp);
    // expect(deserialized.userOrigin).toEqual(account);

    const signTx = new SignTxDescriptor();

    account.unlock(hexToU8a((mnemonicWallet.privateKey).slice(2)));
    await account.init();
    const response = await signTx.requestHandler(request, account);

    console.log('response: ', response);
  });
});

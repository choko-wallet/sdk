// Copyright 2021-2022 @choko-wallet/request-handler authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { hexToU8a, u8aToHex } from '@skyekiwi/util';
import { ethers } from 'ethers';

import { encodeContractCall } from '@choko-wallet/abi';
import { UserAccount } from '@choko-wallet/core';
import { DappDescriptor } from '@choko-wallet/core/dapp';
import { xxHash } from '@choko-wallet/core/util';
import { knownNetworks } from '@choko-wallet/known-networks';

import { SignTxDescriptor, SignTxRequest, SignTxRequestPayload } from './signTx';

const privateKey = '6e00e2fb6feb95393f29e0ceeabebc4f7b2d692b4912663546755b9b8f87b938';
const seed = 'acoustic hover lyrics object execute unfold father give wing hen remain ship';
const contractAddress = '0x46c0D3681a7eE593D59d80d9cFdF5e54Db5BDB79';

describe('@choko-wallet/request-handler-eth - signTx', function () {
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

  afterAll(() => {
    console.log('shutdown WebSocket connector!');
  });

  it('e2e - signTx - ethereum', async () => {
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

    console.log('deserailized.userOrigin: ', deserialized.userOrigin);

    const signTx = new SignTxDescriptor();

    account.unlock(hexToU8a((mnemonicWallet.privateKey).slice(2)));
    await account.init();
    const response = await signTx.requestHandler(request, account);

    console.log('response: ', response);
  });

  it('e2e - signTx - ethereum contract call', async () => {
    account.unlock(hexToU8a((mnemonicWallet.privateKey).slice(2)));
    await account.init();
    account.lock();

    const data = encodeContractCall(
      'test', 'store', [12345]
    );

    /*
    //  function store(uint256 num) public {
    //      number = num;
    //  }
    //  call store method with 12345 parameter...
    */
    console.log('data: ', data);

    const tx = {
      chainId: 4,
      data: data,
      to: contractAddress
    };

    const serializedTx = ethers.utils.serializeTransaction(tx);
    const request = new SignTxRequest({
      dappOrigin: dapp,
      payload: new SignTxRequestPayload({
        encoded: hexToU8a(serializedTx.slice(2))
      }),
      userOrigin: account
    });

    const signTx = new SignTxDescriptor();

    account.unlock(hexToU8a((mnemonicWallet.privateKey).slice(2)));
    await account.init();
    const response = await signTx.requestHandler(request, account);

    console.log('response: ', response);
  });
});

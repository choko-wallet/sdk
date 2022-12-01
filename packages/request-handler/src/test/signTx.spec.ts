// Copyright 2021-2022 @choko-wallet/request-handler authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApiPromise, WsProvider } from '@polkadot/api';
import { hexToU8a } from '@skyekiwi/util';

import { AccountOption, RequestError, UserAccount } from '@choko-wallet/core';
import { DappDescriptor } from '@choko-wallet/core/dapp';
import { SignTxType } from '@choko-wallet/core/types';
import { knownNetworks } from '@choko-wallet/known-networks';

import { SignTxDescriptor, SignTxRequest, SignTxRequestPayload, SignTxResponse, SignTxResponsePayload } from '../signTx';

const SEED = 'leg satisfy enlist dizzy rib owner security live solution panther monitor replace';
const provider = new WsProvider('wss://staging.rpc.skye.kiwi');

const getPolkadotEncodedTx = async (): Promise<Uint8Array> => {
  const api = await ApiPromise.create({ provider: provider });
  const tx = api.tx.balances.transfer(
    '5CQ5PxbmUkAzRnLPUkU65fZtkypqpx8MrKnAfXkSy9eiSeoM',
    1
  );

  return hexToU8a(tx.toHex().substring(2));
};

// const getEthereumEncodedTx = () => {

// }

describe('@choko-wallet/request-handler - signTx', function () {
  const account = new UserAccount(new AccountOption({
    hasEncryptedPrivateKeyExported: false,
    localKeyEncryptionStrategy: 0
  }));
  const dapp = new DappDescriptor({
    activeNetwork: knownNetworks['847e7b7fa160d85f'], // skyekiwi
    displayName: 'Jest Testing',
    infoName: 'test',
    version: 0
  });

  afterAll(() => {
    // Note: not using await here.
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    provider.disconnect();
  });

  it('request serde - signTx - Polkadot', async () => {
    account.unlock(SEED);
    await account.init();
    account.lock();

    const encoded = await getPolkadotEncodedTx();
    const request = new SignTxRequest({
      dappOrigin: dapp,
      payload: new SignTxRequestPayload({
        encoded, signTxType: SignTxType.Ordinary
      }),
      userOrigin: account
    });

    const serialized = request.serialize();

    const deserialized = SignTxRequest.deserialize(serialized);

    expect(deserialized.payload.encoded).toEqual(encoded);
    expect(deserialized.dappOrigin).toEqual(dapp);
    expect(deserialized.userOrigin).toEqual(account);
  });

  it('response serde - signTx', async () => {
    account.unlock(SEED);
    await account.init();
    account.lock();

    const response = new SignTxResponse({
      dappOrigin: dapp,
      payload: new SignTxResponsePayload({
        blockNumber: 12,
        gaslessTxId: new Uint8Array(32),
        txHash: new Uint8Array(32)
      }),
      userOrigin: account
    });

    const serialized = response.serialize();
    const deserialized = SignTxResponse.deserialize(serialized);

    expect(deserialized.payload).toEqual(new SignTxResponsePayload({
      blockNumber: 12,
      gaslessTxId: new Uint8Array(32),
      txHash: new Uint8Array(32)
    }));
    expect(deserialized.dappOrigin).toEqual(dapp);
    expect(deserialized.userOrigin).toEqual(account);
    expect(deserialized.isSuccessful).toEqual(true);
    expect(deserialized.error).toEqual(RequestError.NoError);
  });

  it('e2e - signTx - Polkadot', async () => {
    account.unlock(SEED);
    await account.init();
    account.lock();

    const request = new SignTxRequest({
      dappOrigin: new DappDescriptor({
        activeNetwork: knownNetworks['847e7b7fa160d85f'], // skyekiwi
        displayName: 'Jest Testing',
        infoName: 'test',
        version: 0
      }),
      payload: new SignTxRequestPayload({
        encoded: await getPolkadotEncodedTx(),
        signTxType: SignTxType.Ordinary
      }),
      userOrigin: account
    });

    expect(request.validatePayload()).toBe(true);

    const signTx = new SignTxDescriptor();

    account.unlock(SEED);
    await account.init();

    const response = await signTx.requestHandler(request, account);

    // console.log(response);

    expect(response.isSuccessful).toBe(true);
  });
});

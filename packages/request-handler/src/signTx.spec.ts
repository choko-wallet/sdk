// Copyright 2021-2022 @choko-wallet/request-handler authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApiPromise, WsProvider } from '@polkadot/api';
import { mnemonicToMiniSecret } from '@polkadot/util-crypto';
import { hexToU8a } from '@skyekiwi/util';

import { RequestError, UserAccount } from '@choko-wallet/core';
import { DappDescriptor } from '@choko-wallet/core/dapp';
import { knownNetworks } from '@choko-wallet/known-networks';

import { SignTxDescriptor, SignTxRequest, SignTxRequestPayload, SignTxResponse, SignTxResponsePayload } from './signTx';

const SEED = 'leg satisfy enlist dizzy rib owner security live solution panther monitor replace';
const provider = new WsProvider('wss://staging.rpc.skye.kiwi');

const getEncodedTx = async (): Promise<Uint8Array> => {
  const api = await ApiPromise.create({ provider: provider });
  const tx = api.tx.balances.transfer(
    '5CQ5PxbmUkAzRnLPUkU65fZtkypqpx8MrKnAfXkSy9eiSeoM',
    1
  );
  // console.log("raw tx: ", tx);
  return hexToU8a(tx.toHex().substring(2));
};

describe('@choko-wallet/request-handler - signTx', function () {
  const account = new UserAccount({
    hasEncryptedPrivateKeyExported: false,
    keyType: 'sr25519',
    localKeyEncryptionStrategy: 0
  });
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
  it('request serde - signTx', async () => {
    account.unlock(mnemonicToMiniSecret(SEED));
    await account.init();
    account.lock();

    const encoded = await getEncodedTx();
    const request = new SignTxRequest({
      dappOrigin: dapp,
      payload: new SignTxRequestPayload({ encoded }),
      userOrigin: account
    });

    const serialized = request.serialize();

    const deserialized = SignTxRequest.deserialize(serialized);

    // console.log("account: ", account);
    // console.log("deserailized.userOrigin: ", deserialized.userOrigin);

    expect(deserialized.payload.encoded).toEqual(encoded);
    expect(deserialized.dappOrigin).toEqual(dapp);
    expect(deserialized.userOrigin).toEqual(account);
  });

  it('response serde - signTx', async () => {
    account.unlock(mnemonicToMiniSecret(SEED));
    await account.init();
    account.lock();

    const response = new SignTxResponse({
      dappOrigin: dapp,
      payload: new SignTxResponsePayload({ txHash: new Uint8Array(32) }),
      userOrigin: account
    });

    const serialized = response.serialize();
    const deserialized = SignTxResponse.deserialize(serialized);

    expect(deserialized.payload).toEqual(new SignTxResponsePayload({ txHash: new Uint8Array(32) }));
    expect(deserialized.dappOrigin).toEqual(dapp);
    expect(deserialized.userOrigin).toEqual(account);
    expect(deserialized.isSuccessful).toEqual(true);
    expect(deserialized.error).toEqual(RequestError.NoError);
  });

  it('e2e - signTx - Polkadot', async () => {
    const account = new UserAccount({
      hasEncryptedPrivateKeyExported: false,
      keyType: 'sr25519',
      localKeyEncryptionStrategy: 0
    });

    account.unlock(mnemonicToMiniSecret(SEED));
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
        encoded: await getEncodedTx()
      }),
      userOrigin: account
    });

    expect(request.validatePayload()).toBe(true);

    const signTx = new SignTxDescriptor();

    account.unlock(mnemonicToMiniSecret(SEED));
    await account.init();

    const response = await signTx.requestHandler(request, account);

    // console.log(response);

    expect(response.isSuccessful).toBe(true);
  });
});

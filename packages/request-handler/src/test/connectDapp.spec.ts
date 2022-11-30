// Copyright 2021-2022 @choko-wallet/request-handler authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AccountOption, DappDescriptor, RequestError, UserAccount } from '@choko-wallet/core';
import { knownNetworks } from '@choko-wallet/known-networks';

import { ConnectDappDescriptor, ConnectDappRequest, ConnectDappRequestPayload, ConnectDappResponse, ConnectDappResponsePayload } from '../connectDapp';

const SEED = 'leg satisfy enlist dizzy rib owner security live solution panther monitor replace';

describe('@choko-wallet/request-handler - connectDapp', function () {
  const option = new AccountOption({
    hasEncryptedPrivateKeyExported: false,
    localKeyEncryptionStrategy: 0
  });

  const account = new UserAccount(option);
  const dapp = new DappDescriptor({
    activeNetwork: knownNetworks['847e7b7fa160d85f'], // skyekiwi
    displayName: 'Jest Testing',
    infoName: 'test',
    version: 0
  });

  it('request serde - connectDapp', async () => {
    account.unlock(SEED);
    await account.init();
    account.lock();

    const request = new ConnectDappRequest({
      dappOrigin: dapp,
      payload: new ConnectDappRequestPayload({}),
      userOrigin: account
    });

    const serialized = request.serialize();
    const deserialized = ConnectDappRequest.deserialize(serialized);

    expect(deserialized.payload).toEqual(new ConnectDappRequestPayload({}));
    expect(deserialized.dappOrigin).toEqual(dapp);
    expect(deserialized.userOrigin).toEqual(account);
  });

  it('response serde - connectDapp', async () => {
    account.unlock(SEED);
    await account.init();
    account.lock();

    const response = new ConnectDappResponse({
      dappOrigin: dapp,
      payload: new ConnectDappResponsePayload({
        userAccount: account
      }),
      userOrigin: account
    });

    const serialized = response.serialize();
    const deserialized = ConnectDappResponse.deserialize(serialized);

    expect(deserialized.payload).toEqual(new ConnectDappResponsePayload({
      userAccount: account
    }));
    expect(deserialized.dappOrigin).toEqual(dapp);
    expect(deserialized.userOrigin).toEqual(account);
    expect(deserialized.isSuccessful).toEqual(true);
    expect(deserialized.error).toEqual(RequestError.NoError);
  });

  it('e2e - connectDapp', async () => {
    account.unlock(SEED);
    await account.init();
    account.lock();

    const request = new ConnectDappRequest({
      dappOrigin: dapp,
      payload: new ConnectDappRequestPayload({}),
      userOrigin: account
    });

    expect(request.validatePayload()).toBe(true);

    const connectDapp = new ConnectDappDescriptor();

    account.unlock(SEED);
    await account.init();

    const response = await connectDapp.requestHandler(request, account);

    account.lock();

    expect(response.dappOrigin).toEqual(dapp);
    expect(response.isSuccessful).toEqual(true);
    expect(response.payload.userAccount.serialize()).toEqual(account.serialize());
    expect(response.userOrigin).toEqual(account);
    expect(response.error).toEqual(RequestError.NoError);
  });
});

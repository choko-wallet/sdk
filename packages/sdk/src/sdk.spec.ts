/**
 * @jest-environment jsdom
 */

// Copyright 2021-2022 @choko-wallet/sdk authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { InMemoryStorage } from './type';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { hexToU8a } from '@skyekiwi/util';
import { TextDecoder, TextEncoder } from 'util';

import { AccountOption, UserAccount } from '@choko-wallet/core';
import { SignMessageType, SignTxType } from '@choko-wallet/core/types';

import { buildConnectDappUrl, buildSignMessageUrl, buildSignTxUrl, configSDK, loadStorage, storeUserAccount } from '.';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const provider = new WsProvider('wss://staging.rpc.skye.kiwi');
const SEED = 'leg satisfy enlist dizzy rib owner security live solution panther monitor replace';
const account = new UserAccount(new AccountOption({
  hasEncryptedPrivateKeyExported: false,
  localKeyEncryptionStrategy: 0
}));

// This test needs to run inside the DOM env of Jest. Disabled by default.
describe('@choko-wallet/sdk - request', function () {
  it('e2e - connectDapp', () => {
    let store: InMemoryStorage = loadStorage();

    store = configSDK({
      accountOption: {
        hasEncryptedPrivateKeyExported: false,
        localKeyEncryptionStrategy: 0
      },

      activeNetworkHash: '847e7b7fa160d85f',

      displayName: 'SDK Test',
      infoName: 'test',

      version: 0
    });

    const x = buildConnectDappUrl(store, 'https://localhost:3001');

    console.log(x);
  });

  it('e2e - signTx', async () => {
    account.unlock(SEED);
    await account.init();
    account.lock();

    let store = configSDK({
      accountOption: {
        hasEncryptedPrivateKeyExported: false,
        localKeyEncryptionStrategy: 0
      },

      activeNetworkHash: '847e7b7fa160d85f',

      displayName: 'SDK Test',
      infoName: 'test',

      version: 0
    });

    // ConnectDapp
    store = storeUserAccount(store, account);

    const api = await ApiPromise.create({ provider: provider });
    const tx = api.tx.balances.transfer('5CQ5PxbmUkAzRnLPUkU65fZtkypqpx8MrKnAfXkSy9eiSeoM', 1);
    const encoded = hexToU8a(tx.toHex().substring(2));

    await provider.disconnect();

    const x = buildSignTxUrl(store, encoded, SignTxType.Ordinary, 'https://localhost:3001');

    console.log(x);
  });

  it('e2e - signMessage', async () => {
    account.unlock(SEED);
    await account.init();
    account.lock();

    let store = configSDK({
      accountOption: {
        hasEncryptedPrivateKeyExported: false,
        localKeyEncryptionStrategy: 0
      },

      activeNetworkHash: '847e7b7fa160d85f',

      displayName: 'SDK Test',
      infoName: 'test',

      version: 0
    });

    // ConnectDapp
    store = storeUserAccount(store, account);

    const x = buildSignMessageUrl(store, new Uint8Array([1, 2, 3, 4, 5]), SignMessageType.EthereumPersonalSign, 'https://localhost:3001');

    console.log(x);
  });
});

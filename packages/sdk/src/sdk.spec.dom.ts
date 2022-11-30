// Copyright 2021-2022 @choko-wallet/sdk authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApiPromise, WsProvider } from '@polkadot/api';
import { hexToU8a } from '@skyekiwi/util';
import { TextDecoder, TextEncoder } from 'util';

import { SignMessageType, SignTxType } from '@choko-wallet/core/types';

import { buildConnectDappUrl, buildSignMessageUrl, buildSignTxUrl, configSDK, getUserAccount, storeUserAccount } from '.';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const provider = new WsProvider('wss://staging.rpc.skye.kiwi');

// This test needs to run inside the DOM env of Jest. Disabled by default.
describe('@choko-wallet/sdk - request', function () {
  it('e2e', () => {
    configSDK({
      accountOption: {
        hasEncryptedPrivateKeyExported: false,
        localKeyEncryptionStrategy: 0
      },

      activeNetworkHash: '847e7b7fa160d85f',
      callbackUrlBase: 'https://localhost:3001',

      displayName: 'SDK Test',
      infoName: 'test',

      version: 0
    });

    const x = buildConnectDappUrl();

    console.log(x);
  });

  it('e2e - signTx', async () => {
    configSDK({
      accountOption: {
        hasEncryptedPrivateKeyExported: false,
        localKeyEncryptionStrategy: 0
      },

      activeNetworkHash: '847e7b7fa160d85f',

      callbackUrlBase: 'https://localhost:3001',

      displayName: 'SDK Test',
      infoName: 'test',

      version: 0
    });

    // ConnectDapp
    const account = getUserAccount();

    storeUserAccount(account);

    const api = await ApiPromise.create({ provider: provider });
    const tx = api.tx.balances.transfer('5CQ5PxbmUkAzRnLPUkU65fZtkypqpx8MrKnAfXkSy9eiSeoM', 1);
    const encoded = hexToU8a(tx.toHex().substring(2));

    const x = buildSignTxUrl(encoded, SignTxType.Ordinary);

    console.log(x);
  });

  it('e2e - signTx', () => {
    configSDK({
      accountOption: {
        hasEncryptedPrivateKeyExported: false,
        localKeyEncryptionStrategy: 0
      },

      activeNetworkHash: '847e7b7fa160d85f',

      callbackUrlBase: 'https://localhost:3001',

      displayName: 'SDK Test',
      infoName: 'test',

      version: 0
    });

    // ConnectDapp
    const account = getUserAccount();

    storeUserAccount(account);

    const x = buildSignMessageUrl(new Uint8Array([1, 2, 3, 4, 5]), SignMessageType.EthereumPersonalSign);

    console.log(x);
  });
});

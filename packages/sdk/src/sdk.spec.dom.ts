// Copyright 2021-2022 @choko-wallet/sdk authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApiPromise, WsProvider } from '@polkadot/api';
import { encodeAddress } from '@polkadot/util-crypto';
import { hexToU8a } from '@skyekiwi/util';
import { TextDecoder, TextEncoder } from 'util';

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
        keyType: 'sr25519',
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
        keyType: 'sr25519',
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

    account.publicKey = hexToU8a('463c4dd84fdc93ee6f8fcaf479476246f8b8df4454b2827ae3d89f4eaf779a2b');
    account.address = encodeAddress(account.publicKey);
    storeUserAccount(account);

    const api = await ApiPromise.create({ provider: provider });
    const tx = api.tx.balances.transfer('5CQ5PxbmUkAzRnLPUkU65fZtkypqpx8MrKnAfXkSy9eiSeoM', 1);
    const encoded = hexToU8a(tx.toHex().substring(2));

    const x = buildSignTxUrl(encoded);

    console.log(x);
  });

  it('e2e - signTx', () => {
    configSDK({
      accountOption: {
        hasEncryptedPrivateKeyExported: false,
        keyType: 'sr25519',
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

    account.publicKey = hexToU8a('463c4dd84fdc93ee6f8fcaf479476246f8b8df4454b2827ae3d89f4eaf779a2b');
    account.address = encodeAddress(account.publicKey);
    storeUserAccount(account);

    const x = buildSignMessageUrl(new Uint8Array([1, 2, 3, 4, 5]));

    console.log(x);
  });
});

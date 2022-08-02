// Copyright 2021-2022 @choko-wallet/request-handler authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Keyring from '@polkadot/keyring';
import { mnemonicToMiniSecret } from '@polkadot/util-crypto';

import { UserAccount } from '@choko-wallet/core';
import { DappDescriptor } from '@choko-wallet/core/dapp';
import { knownNetworks } from '@choko-wallet/known-networks';

import { SignMessageDescriptor, SignMessageRequest, SignMessageRequestPayload } from './signMessage';

const SEED = 'leg satisfy enlist dizzy rib owner security live solution panther monitor replace';

describe('@choko-wallet/request-handler - signMessage', function () {
  it('e2e', async () => {
    const msg = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const account = new UserAccount({
      hasEncryptedPrivateKeyExported: false,
      keyType: 'sr25519',
      localKeyEncryptionStrategy: 0
    });

    account.unlock(mnemonicToMiniSecret(SEED));
    await account.init();
    account.lock();

    const request = new SignMessageRequest({
      dappOrigin: new DappDescriptor({
        activeNetwork: knownNetworks['847e7b7fa160d85f'], // skyekiwi
        displayName: 'Jest Testing',
        infoName: 'test',
        version: 0
      }),
      payload: new SignMessageRequestPayload({
        message: msg
      }),
      userOrigin: account
    });

    expect(request.validatePayload()).toBe(true);

    const signMessasge = new SignMessageDescriptor();

    account.unlock(mnemonicToMiniSecret(SEED));
    await account.init();

    const response = await signMessasge.requestHandler(request, account);

    // validate against raw sign
    const kr = (new Keyring({
      type: account.keyType
    })).addFromUri(SEED);

    const res = kr.verify(msg, response.payload.singature, kr.publicKey);

    expect(res).toBe(true);
  });
});

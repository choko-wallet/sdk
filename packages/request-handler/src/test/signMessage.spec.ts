// Copyright 2021-2022 @choko-wallet/request-handler authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeypairType } from '@choko-wallet/core/types';

import Keyring from '@polkadot/keyring';
import { mnemonicToMiniSecret } from '@polkadot/util-crypto';
import { u8aToHex } from '@skyekiwi/util';

import { AccountOption, RequestError, UserAccount } from '@choko-wallet/core';
import { DappDescriptor } from '@choko-wallet/core/dapp';
import { knownNetworks } from '@choko-wallet/known-networks';

import { SignMessageDescriptor, SignMessageRequest, SignMessageRequestPayload, SignMessageResponse, SignMessageResponsePayload } from '../signMessage';

const SEED = 'leg satisfy enlist dizzy rib owner security live solution panther monitor replace';

describe('@choko-wallet/request-handler - signMessage', function () {
  const account = new UserAccount(new AccountOption({
    hasEncryptedPrivateKeyExported: false,
    keyType: 'sr25519',
    localKeyEncryptionStrategy: 0
  }));
  const dapp = new DappDescriptor({
    activeNetwork: knownNetworks['847e7b7fa160d85f'], // skyekiwi
    displayName: 'Jest Testing',
    infoName: 'test',
    version: 0
  });

  it('request serde - signMessage', async () => {
    const msg = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    account.unlock(mnemonicToMiniSecret(SEED));
    await account.init();
    account.lock();

    const request = new SignMessageRequest({
      dappOrigin: dapp,
      payload: new SignMessageRequestPayload({ message: msg }),
      userOrigin: account
    });

    const serialized = request.serialize();

    const deserialized = SignMessageRequest.deserialize(serialized);

    expect(deserialized.payload.message).toEqual(msg);
    expect(deserialized.dappOrigin).toEqual(dapp);
    expect(deserialized.userOrigin).toEqual(account);
  });

  it('response serde - signMessage', async () => {
    account.unlock(mnemonicToMiniSecret(SEED));
    await account.init();
    account.lock();

    const response = new SignMessageResponse({
      dappOrigin: dapp,
      payload: new SignMessageResponsePayload({
        keyType: 'sr25519', signature: new Uint8Array(64)
      }),
      userOrigin: account
    });

    const serialized = response.serialize();
    const deserialized = SignMessageResponse.deserialize(serialized);

    expect(deserialized.payload).toEqual(new SignMessageResponsePayload({
      keyType: 'sr25519', signature: new Uint8Array(64)
    }));
    expect(deserialized.dappOrigin).toEqual(dapp);
    expect(deserialized.userOrigin).toEqual(account);
    expect(deserialized.isSuccessful).toEqual(true);
    expect(deserialized.error).toEqual(RequestError.NoError);
  });

  ['sr25519', 'ed25519', 'ethereum'].map((type) => {
    it(`e2e - signMessage - ${type}`, async () => {
      const msg = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

      const account = new UserAccount(new AccountOption({
        hasEncryptedPrivateKeyExported: false,
        keyType: type as KeypairType,
        localKeyEncryptionStrategy: 0
      }));

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
        type: account.option.keyType
      })).addFromUri('0x' + u8aToHex(account.privateKey));
      // })).addFromUri(SEED); this will fail on ethereum

      const res = kr.verify(msg, response.payload.signature, kr.publicKey);

      expect(res).toBe(true);
    });

    return null;
  });
});

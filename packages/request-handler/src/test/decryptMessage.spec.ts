// Copyright 2021-2022 @choko-wallet/request-handler authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeypairType } from '@choko-wallet/core/types';

import { defaultAccountOption, RequestError, UserAccount } from '@choko-wallet/core';
import { DappDescriptor } from '@choko-wallet/core/dapp';
import { knownNetworks } from '@choko-wallet/known-networks';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { randomBytes } from 'tweetnacl';

import { AsymmetricEncryption } from '@skyekiwi/crypto';

import { DecryptMessageDescriptor, DecryptMessageRequest, DecryptMessageRequestPayload, DecryptMessageResponse, DecryptMessageResponsePayload } from '../decryptMessage';

const SEED = 'leg satisfy enlist dizzy rib owner security live solution panther monitor replace';

describe('@choko-wallet/request-handler - decryptMessage', function () {
  beforeAll(async () => {
    await cryptoWaitReady();
  });

  const option = defaultAccountOption;

  ['ethereum', 'ed25519'].map((keyType, index) => {
    const account = new UserAccount(option);
    const dapp = new DappDescriptor({
      activeNetwork: knownNetworks['847e7b7fa160d85f'], // skyekiwi
      displayName: 'Jest Testing',
      infoName: 'test',
      version: 0
    });

    it(`request serde - decryptMessage ${keyType}`, async () => {
      const msg = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

      account.unlock(SEED);
      await account.init();
      account.lock();
      account.aaWalletAddress = undefined;

      const request = new DecryptMessageRequest({
        dappOrigin: dapp,
        payload: new DecryptMessageRequestPayload({
          keyType: keyType as KeypairType,
          message: msg,
          receiptPublicKey: new Uint8Array(32)
        }),
        userOrigin: account
      });

      const serialized = request.serialize();

      const deserialized = DecryptMessageRequest.deserialize(serialized);

      expect(deserialized.payload.message).toEqual(msg);
      expect(deserialized.payload.receiptPublicKey).toEqual(new Uint8Array(32));
      expect(deserialized.payload.keyType).toEqual(keyType);

      expect(deserialized.dappOrigin).toEqual(dapp);
      expect(deserialized.userOrigin).toEqual(account);
    });

    it(`response serde - decryptMessage ${keyType}`, async () => {
      account.unlock(SEED);
      await account.init();
      account.lock();
      account.aaWalletAddress = undefined;

      const msg = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      const response = new DecryptMessageResponse({
        dappOrigin: dapp,
        payload: new DecryptMessageResponsePayload({
          message: msg
        }),
        userOrigin: account
      });

      const serialized = response.serialize();
      const deserialized = DecryptMessageResponse.deserialize(serialized);

      expect(deserialized.payload).toEqual(new DecryptMessageResponsePayload({
        message: msg
      }));
      expect(deserialized.dappOrigin).toEqual(dapp);
      expect(deserialized.userOrigin).toEqual(account);
      expect(deserialized.isSuccessful).toEqual(true);
      expect(deserialized.error).toEqual(RequestError.NoError);
    });

    it(`e2e - decryptMessage - ${keyType}`, async () => {
      const msg = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

      const account = new UserAccount(option);

      account.unlock(SEED);
      await account.init();
      account.lock();
      account.aaWalletAddress = undefined;

      // 1. generate an encrypted messaage
      const encrypted = AsymmetricEncryption.encryptWithCurveType(keyType as KeypairType, msg, account.publicKeys[index]);

      // 2. Generate a ephemeral keypair for receiving the data
      const receivingSK = randomBytes(32);
      const receivingKey = AsymmetricEncryption.getPublicKey(receivingSK);

      // 3. Build a DecryptMessage Request
      const request = new DecryptMessageRequest({
        dappOrigin: new DappDescriptor({
          activeNetwork: knownNetworks['847e7b7fa160d85f'], // skyekiwi
          displayName: 'Jest Testing',
          infoName: 'test',
          version: 0
        }),
        payload: new DecryptMessageRequestPayload({
          keyType: keyType as KeypairType, message: encrypted, receiptPublicKey: receivingKey
        }),
        userOrigin: account
      });

      expect(request.validatePayload()).toBe(true);

      // 4. Execute the requestHandler
      const decryptMessage = new DecryptMessageDescriptor();

      account.unlock(SEED);
      await account.init();
      const response = await decryptMessage.requestHandler(request, account);

      // 5. Unwrap with the ephermeral keypair!
      const m = response.payload.message;
      const rawM = AsymmetricEncryption.decrypt(receivingSK, m);

      expect(rawM).toEqual(msg);
    });

    return null;
  });
});

// Copyright 2021-2022 @choko-wallet/core authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { mnemonicToMiniSecret } from '@polkadot/util-crypto';

import { AccountOption } from './account';
import { KeypairType } from './types';
import { UserAccount } from '.';

const SEED = 'leg satisfy enlist dizzy rib owner security live solution panther monitor replace';
const Tests = [
  {
    address: '5Deo86WWHTk26vXXywvocQXu3uE6dLcdj22ZF1jBNYhP2UJn',
    keyType: 'sr25519'
  },
  {
    address: '5EM4ibUfzYuUZk2udLZGZi2fcUWTVkN32GhyxA2PFcWRUa5J',
    keyType: 'ed25519'
  },
  {
    address: '0x6cE9942368F9505a6D4A4433BDb3623683a64d8d',
    keyType: 'ethereum'
  }
];

describe('UserAccount - @choko-wallet/core/account', function () {
  const privateKey = mnemonicToMiniSecret(SEED);

  Tests.map((type) => {
    const option = new AccountOption({
      hasEncryptedPrivateKeyExported: false,
      keyType: type.keyType as KeypairType,
      localKeyEncryptionStrategy: 0 // password-v0
    });

    it(`UserAccount - constructor, init, lock/unlock - ${type.keyType}`, async () => {
      const userAccount = new UserAccount(option);

      try {
        await userAccount.init();
      } catch (e) {
        expect(e).toEqual(new Error('account is locked - UserAccount.init'));
      }

      userAccount.unlock(privateKey);
      await userAccount.init();

      expect(userAccount.isLocked).toEqual(false);
      expect(userAccount.address).toEqual(type.address);

      userAccount.lock();
      expect(userAccount.isLocked).toEqual(true);
      expect(userAccount.privateKey).toBeUndefined();
    });

    it(`UserAccount - from seed - ${type.keyType}`, async () => {
      const userAccount = UserAccount.seedToUserAccount(SEED, option);

      expect(userAccount.isLocked).toEqual(false);
      expect(userAccount.address).toBeUndefined();
      expect(userAccount.privateKey).toEqual(privateKey);

      await userAccount.init();

      expect(userAccount.address).toEqual(type.address);
    });

    it(`UserAccount - serde - ${type.keyType}`, async () => {
      const userAccount = UserAccount.seedToUserAccount(SEED, option);

      await userAccount.init();

      // console.log("userAccount: ", userAccount);
      const data = userAccount.serialize();

      const userAccount2 = UserAccount.deserialize(data);

      expect(userAccount2.isLocked).toEqual(true);

      expect(userAccount2.option.hasEncryptedPrivateKeyExported).toEqual(false);
      expect(userAccount2.option.keyType).toEqual(type.keyType);

      expect(userAccount2.option.localKeyEncryptionStrategy).toEqual(0);
      expect(userAccount.address).toEqual(type.address);

      userAccount2.unlock(privateKey);
      await userAccount2.init();
      // console.log("userAccount2: ", userAccount2);

      expect(userAccount2.isLocked).toEqual(false);
      expect(userAccount2.publicKey).toEqual(userAccount.publicKey);
    });

    it(`UserAccount - serdeWithEncryptedKey - ${type.keyType}`, async () => {
      const userAccount = UserAccount.seedToUserAccount(SEED, option);

      await userAccount.init();
      expect(userAccount.address).toEqual(type.address);
      userAccount.encryptUserAccount(new Uint8Array(32));

      const data = userAccount.serializeWithEncryptedKey();
      const userAccount2 = UserAccount.deserializeWithEncryptedKey(data);

      expect(userAccount2.isLocked).toEqual(true);
      expect(userAccount2.option.hasEncryptedPrivateKeyExported).toEqual(false);
      expect(userAccount2.option.keyType).toEqual(type.keyType);
      expect(userAccount2.option.localKeyEncryptionStrategy).toEqual(0);

      expect(userAccount2.address).toEqual(type.address);
      userAccount2.decryptUserAccount(new Uint8Array(32));

      await userAccount2.init();
      // console.log("userAccount2: ", userAccount2);

      expect(userAccount2.isLocked).toEqual(false);
      expect(userAccount2.publicKey).toEqual(userAccount.publicKey);
    });

    return null;
  });
});

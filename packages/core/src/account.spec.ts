// Copyright 2021-2022 @choko-wallet/core authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { mnemonicToMiniSecret } from '@polkadot/util-crypto';
import { u8aToHex } from '@skyekiwi/util';

import { KeypairType } from './types';
import { LockedPrivateKey, UserAccount } from '.';

const SEED = 'leg satisfy enlist dizzy rib owner security live solution panther monitor replace';

const TypeArr = [
  {
    address: '5Deo86WWHTk26vXXywvocQXu3uE6dLcdj22ZF1jBNYhP2UJn',
    keyType: 'sr25519',
    searializedAccount: '463c4dd84fdc93ee6f8fcaf479476246f8b8df4454b2827ae3d89f4eaf779a2b0000000000'
  },
  {
    address: '5EM4ibUfzYuUZk2udLZGZi2fcUWTVkN32GhyxA2PFcWRUa5J',
    keyType: 'ed25519',
    searializedAccount: '64f29df9dfeaee764a7d07394f6cac44a79cfe4599db44b44435c8f2e8e87cfd0001000000'
  },
  {
    address: '0x6cE9942368F9505a6D4A4433BDb3623683a64d8d',
    keyType: 'ethereum',
    searializedAccount: '02e3fc235f0f2a03e290abca0b3eaffbfea18a0163f84eb1e61d5197a081611c2203000000'
  }
];

describe('UserAccount - @choko-wallet/core/account', function () {
  const privateKey = mnemonicToMiniSecret(SEED);

  TypeArr.map((type) => {
    it(`UserAccount - constructor, init, lock/unlock - ${type.keyType}`, async () => {
      const userAccount = new UserAccount({
        hasEncryptedPrivateKeyExported: false,
        keyType: type.keyType as KeypairType,
        localKeyEncryptionStrategy: 0 // password-v0
      });

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
      const userAccount = UserAccount.seedToUserAccount(SEED, {
        hasEncryptedPrivateKeyExported: false,
        keyType: type.keyType as KeypairType,
        localKeyEncryptionStrategy: 0 // password-v0
      });

      expect(userAccount.isLocked).toEqual(false);
      expect(userAccount.address).toBeUndefined();
      expect(userAccount.privateKey).toEqual(privateKey);

      await userAccount.init();

      expect(userAccount.address).toEqual(type.address);
    });

    it(`UserAccount - serde - ${type.keyType}`, async () => {
      const userAccount = UserAccount.seedToUserAccount(SEED, {
        hasEncryptedPrivateKeyExported: false,
        keyType: type.keyType as KeypairType,
        localKeyEncryptionStrategy: 0 // password-v0
      });

      await userAccount.init();

      // console.log("userAccount: ", userAccount);
      const data = userAccount.serialize();

      expect(u8aToHex(data)).toEqual(type.searializedAccount);

      const userAccount2 = UserAccount.deserialize(data);

      expect(userAccount2.isLocked).toEqual(true);

      expect(userAccount2.hasEncryptedPrivateKeyExported).toEqual(false);
      expect(userAccount2.keyType).toEqual(type.keyType);

      expect(userAccount2.localKeyEncryptionStrategy).toEqual(0);
      expect(userAccount.address).toEqual(type.address);

      userAccount2.unlock(privateKey);
      await userAccount2.init();
      // console.log("userAccount2: ", userAccount2);

      expect(userAccount2.isLocked).toEqual(false);
      expect(userAccount2.publicKey).toEqual(userAccount.publicKey);
    });

    it(`LockedPrivateKey - serde - ${type.keyType}`, () => {
      const userAccount = UserAccount.seedToUserAccount(SEED, {
        hasEncryptedPrivateKeyExported: false,
        keyType: type.keyType as KeypairType,
        localKeyEncryptionStrategy: 0 // password-v0
      });

      const lockedPrivateKey = userAccount.lockUserAccount(new Uint8Array(32));

      const data = lockedPrivateKey.serialize();

      const lockedPrivateKey2 = LockedPrivateKey.deserialize(data);

      expect(lockedPrivateKey2.encryptedPrivateKey).toEqual(lockedPrivateKey.encryptedPrivateKey);
      expect(lockedPrivateKey2.keyType).toEqual(lockedPrivateKey.keyType);
      expect(lockedPrivateKey2.localKeyEncryptionStrategy).toEqual(lockedPrivateKey.localKeyEncryptionStrategy);
      expect(lockedPrivateKey2.hasEncryptedPrivateKeyExported).toEqual(lockedPrivateKey.hasEncryptedPrivateKeyExported);
      expect(lockedPrivateKey2.version).toEqual(lockedPrivateKey.version);
    });

    return null;
  });
});

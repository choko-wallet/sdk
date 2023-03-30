// Copyright 2021-2022 @choko-wallet/core authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { mnemonicToEntropy } from '@polkadot/util-crypto';
import { ethers } from 'ethers';

import { KeypairType } from './types';
import { defaultAccountOption, UserAccount } from '.';

const SEED = 'leg satisfy enlist dizzy rib owner security live solution panther monitor replace';
const Tests = [
  {
    address: '5EM4ibUfzYuUZk2udLZGZi2fcUWTVkN32GhyxA2PFcWRUa5J',
    keyType: 'ed25519'
  },
  {
    address: '0x9845e6eFf7d7b09284506581574017b3EEE0afD5',
    keyType: 'ethereum'
  }
];

describe('UserAccount - @choko-wallet/core/account', function () {
  Tests.map((type) => {
    it(`UserAccount - constructor, init, lock/unlock - ${type.keyType}`, async () => {
      const userAccount = new UserAccount(defaultAccountOption);

      try {
        await userAccount.init();
      } catch (e) {
        expect(e).toEqual(new Error('account is locked - UserAccount.init'));
      }

      userAccount.unlock(SEED);
      await userAccount.init();

      expect(userAccount.isLocked).toEqual(false);
      expect(userAccount.getAddress(type.keyType as KeypairType)).toEqual(type.address);

      userAccount.lock();
      expect(userAccount.isLocked).toEqual(true);
      expect(userAccount.entropy).toBeUndefined();
    });

    it(`UserAccount - serde - ${type.keyType}`, async () => {
      const userAccount = new UserAccount(defaultAccountOption);

      userAccount.unlock(SEED);
      await userAccount.init();

      // console.log("userAccount: ", userAccount);
      const data = userAccount.serialize();
      const userAccount2 = UserAccount.deserialize(data);

      expect(userAccount2.isLocked).toEqual(true);
      expect(userAccount2.option.hasEncryptedPrivateKeyExported).toEqual(false);
      expect(userAccount2.option.localKeyEncryptionStrategy).toEqual(0);
      expect(userAccount.getAddress(type.keyType as KeypairType)).toEqual(type.address);

      userAccount2.unlock(SEED);
      await userAccount2.init();

      expect(userAccount2.isLocked).toEqual(false);
      expect(userAccount2.publicKeys.length).toEqual(2);
      expect(userAccount2.publicKeys[0]).toEqual(userAccount.publicKeys[0]);
      expect(userAccount2.publicKeys[1]).toEqual(userAccount.publicKeys[1]);
    });

    it(`UserAccount - serdeWithEncryptedKey - ${type.keyType}`, async () => {
      const userAccount = new UserAccount(defaultAccountOption);

      userAccount.unlock(SEED);
      await userAccount.init();

      userAccount.encryptUserAccount(new Uint8Array(32));

      const data = userAccount.serializeWithEncryptedKey();
      const userAccount2 = UserAccount.deserializeWithEncryptedKey(data);

      expect(userAccount2.isLocked).toEqual(true);
      expect(userAccount2.option.hasEncryptedPrivateKeyExported).toEqual(false);
      expect(userAccount2.option.localKeyEncryptionStrategy).toEqual(0);

      expect(userAccount2.publicKeys[0]).toEqual(userAccount.publicKeys[0]);
      expect(userAccount2.publicKeys[1]).toEqual(userAccount.publicKeys[1]);

      userAccount2.decryptUserAccount(new Uint8Array(32));
      await userAccount2.init();

      expect(userAccount2.isLocked).toEqual(false);
      expect(userAccount2.entropy).toEqual(mnemonicToEntropy(SEED));
    });

    return null;
  });

  test('ethersjs compatibility for account generation', async () => {
    const userAccount = new UserAccount(defaultAccountOption);

    userAccount.unlock(SEED);
    await userAccount.init();

    const ethersJsWallet = ethers.Wallet.fromMnemonic(SEED);

    expect(ethersJsWallet.address).toEqual(userAccount.getAddress('ethereum'));
  });
});

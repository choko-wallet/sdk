// Copyright 2021-2022 @choko-wallet/request-handler authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { defaultAccountOption, RequestError, UserAccount } from '@choko-wallet/core';
import { DappDescriptor } from '@choko-wallet/core/dapp';
import { KeypairType, SignMessageType } from '@choko-wallet/core/types';
import { knownNetworks } from '@choko-wallet/known-networks';
import Keyring from '@polkadot/keyring';
import { entropyToMnemonic } from '@polkadot/util-crypto/mnemonic/bip39';
import { ethers } from 'ethers';
import { hashMessage } from 'ethers/lib/utils';

import { u8aToHex } from '@skyekiwi/util';

import { SignMessageDescriptor, SignMessageRequest, SignMessageRequestPayload, SignMessageResponse, SignMessageResponsePayload } from '../signMessage';

const SEED = 'leg satisfy enlist dizzy rib owner security live solution panther monitor replace';

describe('@choko-wallet/request-handler - signMessage', function () {
  const account = new UserAccount(defaultAccountOption);
  const dapp = new DappDescriptor({
    activeNetwork: knownNetworks['847e7b7fa160d85f'], // skyekiwi
    displayName: 'Jest Testing',
    infoName: 'test',
    version: 0
  });

  it('request serde - signMessage', async () => {
    const msg = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    account.unlock(SEED);
    await account.init();
    account.lock();
    account.aaWalletAddress = undefined;

    const request = new SignMessageRequest({
      dappOrigin: dapp,
      payload: new SignMessageRequestPayload({ message: msg, signMessageType: SignMessageType.RawEd25519 }),
      userOrigin: account
    });

    const serialized = request.serialize();

    const deserialized = SignMessageRequest.deserialize(serialized);

    expect(deserialized.payload.message).toEqual(msg);
    expect(deserialized.dappOrigin).toEqual(dapp);
    expect(deserialized.userOrigin).toEqual(account);
  });

  it('response serde - signMessage', async () => {
    account.unlock(SEED);
    await account.init();
    account.lock();
    account.aaWalletAddress = undefined;

    const response = new SignMessageResponse({
      dappOrigin: dapp,
      payload: new SignMessageResponsePayload({
        signMessageType: SignMessageType.RawEd25519, signature: new Uint8Array(64)
      }),
      userOrigin: account
    });

    const serialized = response.serialize();
    const deserialized = SignMessageResponse.deserialize(serialized);

    expect(deserialized.payload).toEqual(new SignMessageResponsePayload({
      signMessageType: SignMessageType.RawEd25519, signature: new Uint8Array(64)
    }));
    expect(deserialized.dappOrigin).toEqual(dapp);
    expect(deserialized.userOrigin).toEqual(account);
    expect(deserialized.isSuccessful).toEqual(true);
    expect(deserialized.error).toEqual(RequestError.NoError);
  });

  [SignMessageType.EthereumPersonalSign, SignMessageType.RawEd25519].map((type) => {
    it(`e2e - signMessage - ${SignMessageType[type]}`, async () => {
      const msg = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

      const account = new UserAccount(defaultAccountOption);

      account.unlock(SEED);
      await account.init();
      account.lock();
      account.aaWalletAddress = undefined;

      const request = new SignMessageRequest({
        dappOrigin: new DappDescriptor({
          activeNetwork: knownNetworks['847e7b7fa160d85f'], // skyekiwi
          displayName: 'Jest Testing',
          infoName: 'test',
          version: 0
        }),
        payload: new SignMessageRequestPayload({
          message: msg,
          signMessageType: type
        }),
        userOrigin: account
      });

      expect(request.validatePayload()).toBe(true);

      const signMessasge = new SignMessageDescriptor();

      account.unlock(SEED);
      await account.init();

      const response = await signMessasge.requestHandler(request, account);

      // validate against raw sign
      if (type === SignMessageType.EthereumPersonalSign) {
        const recovered = ethers.utils.recoverAddress(
          hashMessage(msg), '0x' + u8aToHex(response.payload.signature)
        );

        expect(recovered).toEqual(account.getAddress('ethereum'));
      } else {
        const k = (new Keyring({ type: 'ed25519' as KeypairType }))
          .addFromMnemonic(entropyToMnemonic(account.entropy));

        const r = k.verify(msg, response.payload.signature, k.publicKey);

        expect(r).toBe(true);
      }
    });

    return null;
  });

  test('ethereum personal sign compatibility', async () => {
    const msg = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const account = new UserAccount(defaultAccountOption);

    account.unlock(SEED);
    await account.init();
    account.lock();
    account.aaWalletAddress = undefined;

    const request = new SignMessageRequest({
      dappOrigin: new DappDescriptor({
        activeNetwork: knownNetworks['847e7b7fa160d85f'], // skyekiwi
        displayName: 'Jest Testing',
        infoName: 'test',
        version: 0
      }),
      payload: new SignMessageRequestPayload({
        message: msg,
        signMessageType: SignMessageType.EthereumPersonalSign
      }),
      userOrigin: account
    });

    expect(request.validatePayload()).toBe(true);

    const signMessasge = new SignMessageDescriptor();

    account.unlock(SEED);
    await account.init();

    const response = await signMessasge.requestHandler(request, account);

    const wallet = ethers.Wallet.fromMnemonic(entropyToMnemonic(account.entropy));
    const sig = await wallet.signMessage(msg);

    expect(sig).toEqual('0x' + u8aToHex(response.payload.signature));

    // dump it out for verification on etherscan
    // console.log(account.getAddress('ethereum'))
    // console.log('0x' + u8aToHex(msg));
    // console.log(sig);
  });
});

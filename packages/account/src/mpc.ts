// Copyright 2021-2022 @choko-wallet/account authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Address, LocalAccount } from 'viem';

import { ethereumEncode } from '@polkadot/util-crypto';
import { secureGenerateRandomKey } from '@skyekiwi/crypto';
import { hashMessage, hashTypedData, keccak256, serializeTransaction, toBytes, toHex } from 'viem';
import { toAccount } from 'viem/accounts';

import { runKeygenRequest, runKeyRefreshRequest, runSignRequest } from '@choko-wallet/mpc';
import { extractPublicKey, extractSignature } from '@choko-wallet/mpc/interface';

export class MpcAccount {
  localKey: string;
  authHeader: string;
  publicKey: Uint8Array = new Uint8Array(33);

  constructor (localKey?: string, authHeader?: string) {
    this.localKey = localKey;
    this.authHeader = authHeader;

    if (localKey && authHeader) {
      this.publicKey = extractPublicKey(localKey);
    }
  }

  public static async newAccount (authHeader: string): Promise<MpcAccount> {
    const payloadId = secureGenerateRandomKey();
    const localKey = await runKeygenRequest(payloadId, authHeader);

    return new MpcAccount(localKey, authHeader);
  }

  public static async refreshLocalKey (authHeader: string): Promise<MpcAccount> {
    const payloadId = secureGenerateRandomKey();
    const localKey = await runKeyRefreshRequest(payloadId, authHeader);

    return new MpcAccount(localKey, authHeader);
  }

  public getAddress (): Address {
    return ethereumEncode(this.publicKey);
  }

  private async signMessageWithMpc (hashedMessage: Uint8Array): Promise<Uint8Array> {
    // message is hashed!
    const payloadId = secureGenerateRandomKey();
    const rawSig = await runSignRequest(
      payloadId,
      this.authHeader,
      this.localKey,
      hashedMessage);

    return extractSignature(rawSig);
  }

  public toViemAccount (): LocalAccount {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const ctx = this;

    if (this.localKey && this.localKey.length !== 0) {
      return toAccount({
        address: this.getAddress(),
        async signMessage ({ message }) {
          const hashedMessage = toBytes(hashMessage(message));

          return toHex(await ctx.signMessageWithMpc(hashedMessage));
        },
        async signTransaction (transaction) {
          const hashedTransaction = toBytes(keccak256(serializeTransaction(transaction)));

          return toHex(await ctx.signMessageWithMpc(hashedTransaction));
        },
        async signTypedData (typedData) {
          const hashedData = toBytes(hashTypedData(typedData));

          return toHex(await ctx.signMessageWithMpc(hashedData));
        }
      });
    } else {
      throw new Error('MpcAccount not initialized');
    }
  }
}

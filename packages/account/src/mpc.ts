
import { Address, LocalAccount, hashMessage, hashTypedData, keccak256, serializeTransaction, toBytes, toHex } from "viem";
import { ethereumEncode } from '@polkadot/util-crypto';

import { extractPublicKey, extractSignature } from "@choko-wallet/mpc/interface";
import { toAccount } from "viem/accounts";
import { runSignRequest } from "@choko-wallet/mpc";
import { secureGenerateRandomKey } from '@skyekiwi/crypto'
export class MpcAccount {
  localKey: string;
  authHeader: string;
  publicKey: Uint8Array = new Uint8Array(33);

  constructor(localKey?: string, authHeader?: string) {
    this.localKey = localKey;
    this.authHeader = authHeader;

    if (localKey && authHeader) {
      this.publicKey = extractPublicKey(localKey)
    }
  }

  public getAddress(): Address {
    return ethereumEncode(this.publicKey)
  }

  private async signMessageWithMpc(hashedMessage: Uint8Array): Promise<Uint8Array> {
    // message is hashed!
    const payloadId = secureGenerateRandomKey();
    const rawSig = await runSignRequest(
      payloadId,
      this.authHeader,
      this.localKey,
      hashedMessage);
    return extractSignature(rawSig);
  }

  public toViemAccount(): LocalAccount {
    const ctx = this;
    if (this.localKey && this.localKey.length !== 0) {
      return toAccount({
        address: this.getAddress(),
        async signMessage({ message }) {
          const hashedMessage = toBytes(hashMessage(message));
          return toHex(await ctx.signMessageWithMpc(hashedMessage));
        },
        async signTransaction(transaction) {
          const hashedTransaction = toBytes(keccak256(serializeTransaction(transaction)));
          return toHex(await ctx.signMessageWithMpc(hashedTransaction));
        },
        async signTypedData(typedData) {
          const hashedData = toBytes(hashTypedData(typedData));
          return toHex(await ctx.signMessageWithMpc(hashedData));
        }
      })
    } else {
      throw new Error("MpcAccount not initialized");
    }
  }
}
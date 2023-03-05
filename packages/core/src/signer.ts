// Copyright 2021-2022 @choko-wallet/core authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Keyring from '@polkadot/keyring';
import { entropyToMnemonic } from '@polkadot/util-crypto/mnemonic/bip39';
import { hexToU8a, u8aToHex } from '@skyekiwi/util';
import { ethers, Transaction, TypedDataEncoder, VoidSigner } from 'ethers';

import { unlockedUserAccountToEthersJsWallet } from '@choko-wallet/account-abstraction';
import { IWalletTransaction } from '@choko-wallet/account-abstraction/types';

import { UserAccount } from './account';
import { chainIdToProvider } from './etherProviders';
import { IMiniEthTransaction, ITxResponse, SignMessageType } from './types';

export class Signer {
  account: UserAccount
  mpcSignFunc?: (msg: Uint8Array, account: UserAccount) => Promise<Uint8Array>

  constructor (
    account: UserAccount,
    mpcSignFunc?: (msg: Uint8Array, account: UserAccount) => Promise<Uint8Array>
  ) {
    this.account = account;
    this.mpcSignFunc = mpcSignFunc;
  }

  public getEthereumAddress (): string {
    return this.account.getAddress('ethereum');
  }

  public async signMessage (message: Uint8Array, signType: SignMessageType): Promise<Uint8Array> {
    // if we have a regular seed account
    if (!this.account.isLocked) {
      let signature: Uint8Array;

      switch (signType) {
        case SignMessageType.RawSr25519: {
          const kr = (new Keyring({ type: 'sr25519' })).addFromMnemonic(entropyToMnemonic(this.account.entropy));

          signature = kr.sign(message);
          break;
        }

        case SignMessageType.RawEd25519: {
          const kr = (new Keyring({ type: 'ed25519' })).addFromMnemonic(entropyToMnemonic(this.account.entropy));

          signature = kr.sign(message);
          break;
        }

        case SignMessageType.EthereumPersonalSign: {
          const wallet = ethers.Wallet.fromPhrase(entropyToMnemonic(this.account.entropy));

          signature = hexToU8a((await wallet.signMessage(message)).slice(2));
          break;
        }
      }

      return signature;
    } else if (this.account.option.accountType === 1) {
      // if we are in an mpc wallet
      switch (signType) {
        case SignMessageType.RawSr25519: {
          throw new Error('Sr25519 Sign not supported for MPC accounts yet');
          break;
        }

        case SignMessageType.RawEd25519: {
          throw new Error('Ed25519 Sign not supported for MPC accounts yet');
          break;
        }

        case SignMessageType.EthereumPersonalSign: {
          if (!this.account.mpcKeygenId || !this.account.mpcLocalKey) {
            throw new Error('necessary MPC sign info is mssing');
          }

          const hash = hexToU8a(ethers.hashMessage(message).substring(2));

          return await this.mpcSignFunc(hash, this.account);
        }
      }
    } else {
      throw new Error('account must be either an mpc account or an unlocked account');
    }
  }

  public async signAAWalletCalldata (smartWalletAddress: string, chainId: number, tx: IWalletTransaction): Promise<Uint8Array> {
    tx.nonce = tx.nonce.toString();
    /* eslint-disable */
    const rawHash = TypedDataEncoder.hash(
      { verifyingContract: smartWalletAddress, chainId: chainId },
      {
        WalletTx: [
          { type: 'address', name: 'to' },
          { type: 'uint256', name: 'value' },
          { type: 'bytes', name: 'data' },
          { type: 'uint8', name: 'operation' },
          { type: 'uint256', name: 'targetTxGas' },
          { type: 'uint256', name: 'baseGas' },
          { type: 'uint256', name: 'gasPrice' },
          { type: 'address', name: 'gasToken' },
          { type: 'address', name: 'refundReceiver' },
          { type: 'uint256', name: 'nonce' }
        ]
      }, tx
    );
    /* eslint-enable */

    const hash = hexToU8a(rawHash.substring(2));

    return await this.signMessage(hash, SignMessageType.EthereumPersonalSign);
  }

  public async signEthTx (tx: IMiniEthTransaction, chainId: number): Promise<string> {
    const provider = chainIdToProvider[chainId];

    if (!provider) {
      throw new Error('chain not supported yet');
    }

    /* eslint-disable */
    // @ts-ignore
    const dummySigner = new VoidSigner(this.account.getAddress('ethereum'), provider);
    /* eslint-enable */

    const pop = await dummySigner.populateTransaction(tx);

    const builtTx = Transaction.from(pop);
    const hash = hexToU8a(builtTx.unsignedHash.substring(2));

    if (!this.account.isLocked) {
      const wallet = unlockedUserAccountToEthersJsWallet(this.account, provider);

      return await wallet.signTransaction(tx);
    } else if (this.account.option.accountType === 1) {
      // if we are in an mpc wallet
      if (!this.account.mpcKeygenId || !this.account.mpcLocalKey) {
        throw new Error('necessary MPC sign info is mssing');
      }

      const signature = await this.mpcSignFunc(hash, this.account);

      builtTx.signature = `0x${u8aToHex(signature)}`;

      return builtTx.serialized;
    } else {
      throw new Error('account must be either an mpc account or an unlocked account');
    }
  }

  public async sendTransaction (tx: IMiniEthTransaction, chainId: number): Promise<ITxResponse> {
    const provider = chainIdToProvider[chainId];
    const signedTx = await this.signEthTx(tx, chainId);
    const result = await provider.sendTransaction(signedTx);

    return {
      blockNumber: result.blockNumber,
      txHash: hexToU8a(result.hash.substring(2))
    };
  }
}

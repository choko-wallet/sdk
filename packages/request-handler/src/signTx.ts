// Copyright 2021-2022 @choko-wallet/request-handler authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IWalletTransaction } from '@choko-wallet/account-abstraction/types';
import type { HexString, Version } from '@choko-wallet/core/types';
import type { SubmittableExtrinsic } from '@polkadot/api/promise/types';

import { biconomyFixtures, callDataExecTransaction, sendBiconomyTxPayload } from '@choko-wallet/account-abstraction';
import { chainIdToProvider, DappDescriptor, deserializeRequestError, IDappDescriptor, IPayload, IRequest, IRequestHandlerDescriptor, IResponse, RequestError, RequestErrorSerializedLength, serializeRequestError, UserAccount, xxHash } from '@choko-wallet/core';
import { Signer } from '@choko-wallet/core/signer';
import { CURRENT_VERSION, SignTxType } from '@choko-wallet/core/types';
import { ApiPromise, WsProvider } from '@polkadot/api';
import Keyring from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { entropyToMnemonic } from '@polkadot/util-crypto/mnemonic/bip39';
import { ethers } from 'ethers';

import { padSize, sleep, u8aToHex, unpadSize } from '@skyekiwi/util';

export const signTxHash: HexString = u8aToHex(xxHash('signTx'));

/**
 *
 * @Request the encoded transaction to be signed and sent
 * @param {Uint8Array} encoded the encoded transaction, MAX LENGTH: 512
 *
 * @Response the transaction result
 * @param {Uint8Array} txHash the transaction hash - always 32 bytes long
 *
 * @requestHandler sign and send the transaction to the network defaultProvider for the Dapp's activeNetwork
 */

export class SignTxRequestPayload implements IPayload {
  public readonly encoded: Uint8Array;
  public readonly signTxType: SignTxType;
  public readonly version: Version;

  constructor (config: {
    encoded: Uint8Array,
    signTxType: SignTxType,
    version?: Version
  }) {
    const { encoded, signTxType } = config;

    if (encoded.length >= 2048) {
      throw new Error('message too long');
    }

    this.encoded = encoded;
    this.signTxType = signTxType;
    this.version = config.version || CURRENT_VERSION;
  }

  public static serializedLength (): number {
    return 2048 + 4 + 1 + 1;
  }

  public build (): Uint8Array {
    const res = new Uint8Array(SignTxRequestPayload.serializedLength());

    res.set(padSize(this.encoded.length), 0);
    res.set(this.encoded, 4);
    res.set([this.signTxType], 4 + 2048);
    res.set([this.version], 4 + 2048 + 1);

    return res;
  }

  public static parse (data: Uint8Array): SignTxRequestPayload {
    if (data.length !== SignTxRequestPayload.serializedLength()) {
      throw new Error('invalid length');
    }

    const msgLength = unpadSize(data.slice(0, 4));
    const msg = data.slice(4, 4 + msgLength);

    return new SignTxRequestPayload({
      encoded: msg,
      signTxType: data[4 + 2048],
      version: data[4 + 2048 + 1]
    });
  }
}

export class SignTxResponsePayload implements IPayload {
  public readonly blockNumber: number;
  public readonly gaslessTxId: Uint8Array;
  public readonly txHash: Uint8Array;
  public readonly version: Version;

  constructor (config: {
    blockNumber: number,
    gaslessTxId: Uint8Array,
    txHash: Uint8Array,
    version?: Version
  }) {
    const { blockNumber, gaslessTxId, txHash } = config;

    this.blockNumber = blockNumber;
    this.gaslessTxId = gaslessTxId;
    this.txHash = txHash;
    this.version = config.version || CURRENT_VERSION;
  }

  public static serializedLength (): number {
    return 4 + // blockNumber - padSize(blockNumber)
      32 + // gassless tx id - will be 0x0 if not exist
      32 +// txHash size for both substrate & ethereum
      1; // version
  }

  public build (): Uint8Array {
    const res = new Uint8Array(SignTxResponsePayload.serializedLength());

    res.set(padSize(this.blockNumber), 0);
    res.set(this.gaslessTxId, 4);
    res.set(this.txHash, 32 + 4);
    res.set([this.version], 32 + 32 + 4);

    return res;
  }

  public static parse (data: Uint8Array): SignTxResponsePayload {
    if (data.length !== SignTxResponsePayload.serializedLength()) {
      throw new Error('invalid length');
    }

    return new SignTxResponsePayload({
      blockNumber: unpadSize(data.slice(0, 4)),
      gaslessTxId: data.slice(4, 4 + 32),
      txHash: data.slice(32 + 4, 32 + 32 + 4),
      version: data[32 + 32 + 4]
    });
  }
}

export class SignTxRequest implements IRequest {
  dappOrigin: IDappDescriptor;
  userOrigin: UserAccount;

  type: HexString;

  isRemote: boolean; // do we need to interact with blockchain?
  payload: SignTxRequestPayload;

  version: Version;

  constructor (config: {
    dappOrigin: IDappDescriptor,
    payload: SignTxRequestPayload,
    userOrigin: UserAccount,

    version?: Version,
  }) {
    const { dappOrigin, payload, userOrigin } = config;

    if (!userOrigin.isLocked) {
      throw new Error('userOrigin is not LOCKED. Aborting. ');
    }

    this.dappOrigin = dappOrigin;
    this.userOrigin = userOrigin;

    this.payload = payload;
    this.type = signTxHash;
    this.isRemote = true;

    this.version = config.version || CURRENT_VERSION;
  }

  // TODO: validate if the call is valid
  public validatePayload (): boolean {
    try {
      this.payload.build();

      return true;
    } catch (e) {
      return false;
    }
  }

  public static serializedLength (): number {
    return DappDescriptor.serializedLength() + // version
      UserAccount.serializedLength() + // type
      SignTxRequestPayload.serializedLength() +
      2; // version
  }

  public serialize (): Uint8Array {
    const res = new Uint8Array(SignTxRequest.serializedLength());

    res.set(this.dappOrigin.serialize(), 0);
    res.set(this.userOrigin.serialize(), DappDescriptor.serializedLength());
    res.set(this.payload.build(), DappDescriptor.serializedLength() + UserAccount.serializedLength());
    res.set([this.version, this.version],
      DappDescriptor.serializedLength() + UserAccount.serializedLength() + SignTxRequestPayload.serializedLength()
    );

    return res;
  }

  public static deserialize (data: Uint8Array): SignTxRequest {
    if (data.length !== SignTxRequest.serializedLength()) {
      throw new Error('invalid length');
    }

    const dappOrigin = DappDescriptor.deserialize(data.slice(0, DappDescriptor.serializedLength()));
    const userOrigin = UserAccount.deserialize(data.slice(DappDescriptor.serializedLength(),
      DappDescriptor.serializedLength() + UserAccount.serializedLength()
    ));
    const payload = SignTxRequestPayload.parse(data.slice(
      DappDescriptor.serializedLength() + UserAccount.serializedLength(),
      DappDescriptor.serializedLength() + UserAccount.serializedLength() + SignTxRequestPayload.serializedLength()
    ));
    const version = data[DappDescriptor.serializedLength() + UserAccount.serializedLength() + SignTxRequestPayload.serializedLength()];

    return new SignTxRequest({
      dappOrigin: dappOrigin,
      payload: payload,
      userOrigin: userOrigin,
      version: version
    });
  }
}

export class SignTxResponse implements IResponse {
  dappOrigin: IDappDescriptor;
  userOrigin: UserAccount;

  type: HexString;

  isSuccessful: boolean;

  error?: RequestError;
  payload: SignTxResponsePayload;

  version: Version;

  constructor (config: {
    dappOrigin: IDappDescriptor,
    userOrigin: UserAccount,

    payload: SignTxResponsePayload,
    error?: RequestError,
    version?: Version,
  }) {
    const { dappOrigin, error, payload, userOrigin } = config;

    this.dappOrigin = dappOrigin;
    this.userOrigin = userOrigin;
    this.payload = payload;
    this.type = signTxHash;
    this.version = CURRENT_VERSION;

    if (!error) {
      this.isSuccessful = true;
      this.error = RequestError.NoError;
    } else {
      this.isSuccessful = false;
      this.error = error;
    }
  }

  public validatePayload (): boolean {
    try {
      this.payload.build();

      return true;
    } catch (e) {
      return false;
    }
  }

  public static serializedLength (): number {
    return DappDescriptor.serializedLength() +
      UserAccount.serializedLength() +
      SignTxResponsePayload.serializedLength() +
      RequestErrorSerializedLength +
      2; // version
  }

  public serialize (): Uint8Array {
    const res = new Uint8Array(SignTxResponse.serializedLength());

    res.set(this.dappOrigin.serialize(), 0);
    res.set(this.userOrigin.serialize(), DappDescriptor.serializedLength());
    res.set(this.payload.build(), DappDescriptor.serializedLength() + UserAccount.serializedLength());
    res.set(serializeRequestError(this.error),
      DappDescriptor.serializedLength() + UserAccount.serializedLength() +
      SignTxResponsePayload.serializedLength());
    res.set([this.version, this.version],
      DappDescriptor.serializedLength() + UserAccount.serializedLength() +
      SignTxResponsePayload.serializedLength() + RequestErrorSerializedLength);

    return res;
  }

  public static deserialize (data: Uint8Array): SignTxResponse {
    if (data.length !== SignTxResponse.serializedLength()) {
      throw new Error('invalid length');
    }

    const dappOrigin = DappDescriptor.deserialize(data.slice(0, DappDescriptor.serializedLength()));
    const userOrigin = UserAccount.deserialize(data.slice(DappDescriptor.serializedLength(),
      DappDescriptor.serializedLength() + UserAccount.serializedLength()
    ));

    const payload = SignTxResponsePayload.parse(data.slice(
      DappDescriptor.serializedLength() + UserAccount.serializedLength(),
      DappDescriptor.serializedLength() + UserAccount.serializedLength() + SignTxResponsePayload.serializedLength()
    ));
    const error = deserializeRequestError(data.slice(
      DappDescriptor.serializedLength() + UserAccount.serializedLength() + SignTxResponsePayload.serializedLength(),
      DappDescriptor.serializedLength() + UserAccount.serializedLength() + SignTxResponsePayload.serializedLength() + RequestErrorSerializedLength
    ));
    const version = data[DappDescriptor.serializedLength() + UserAccount.serializedLength() +
      SignTxResponsePayload.serializedLength() + RequestErrorSerializedLength];

    return new SignTxResponse({
      dappOrigin: dappOrigin,
      error: error,
      payload: payload,
      userOrigin: userOrigin,
      version: version
    });
  }
}

export class SignTxDescriptor implements IRequestHandlerDescriptor {
  description: string;
  name: string;

  userApprovalRequired: boolean; // do we send the request to wallet approval?

  version: Version;

  constructor () {
    this.description = 'submit a transaction to blockchain';
    this.name = 'signTx';

    this.userApprovalRequired = true;

    this.version = CURRENT_VERSION;
  }

  public async requestHandler (request: SignTxRequest, account: UserAccount,
    mpcSignFn?: (msg: Uint8Array, account: UserAccount, auth?: string) => Promise<Uint8Array>,
    auth?: string
  ): Promise<SignTxResponse> {
    await cryptoWaitReady();

    let err = RequestError.NoError;

    if (account.isLocked && account.option.accountType !== 1) {
      err = RequestError.AccountLocked;
    }

    const signer = new Signer(account, mpcSignFn);

    let txHash: Uint8Array = new Uint8Array(32);
    let blockNumber = 0;
    let gaslessTxId: Uint8Array = new Uint8Array(32);
    let response: SignTxResponse;

    switch (request.payload.signTxType) {
      case SignTxType.Ordinary:
        if (request.dappOrigin.activeNetwork.networkType === 'polkadot') {
          const provider = new WsProvider(request.dappOrigin.activeNetwork.defaultProvider);
          const api = await ApiPromise.create({ provider: provider });

          const mnemonic = entropyToMnemonic(account.entropy);
          const kr = (new Keyring({ type: 'ed25519' })).addFromMnemonic(mnemonic);

          const sendTx = (ext: SubmittableExtrinsic, kr: KeyringPair): Promise<[Uint8Array, number]> => {
            let blockNumber = 0;

            return new Promise((resolve) => {
              ext.signAndSend(kr, (result) => {
                api.query.system.number().then((value) => {
                  blockNumber = value.toJSON() as number;

                  if (result.status.isInBlock) {
                    resolve([result.txHash.toU8a(), blockNumber]);
                  }
                }).catch((e) => {
                  console.log(e);
                });
              }).catch((e) => {
                console.log(e);
                resolve([new Uint8Array(32), 0]);
              });
            });
          };

          [txHash, blockNumber] = await sendTx(api.tx(request.payload.encoded), kr);
          await provider.disconnect();
        } else {
          const deserializedTx = ethers.utils.parseTransaction('0x' + u8aToHex(request.payload.encoded));
          const txResponse = await signer.sendTransaction({
            data: deserializedTx.data,
            to: deserializedTx.to,
            value: deserializedTx.value.toString()
          }, request.dappOrigin.activeNetwork.chainId, auth);

          txHash = txResponse.txHash;
          blockNumber = txResponse.blockNumber;
        }

        response = new SignTxResponse({
          dappOrigin: request.dappOrigin,
          error: err,
          payload: new SignTxResponsePayload({
            blockNumber: blockNumber,
            gaslessTxId: new Uint8Array(32),
            txHash: txHash
          }),
          userOrigin: request.userOrigin
        });
        break;

      case SignTxType.AACall:
      case SignTxType.AACallBatch:
        if (request.dappOrigin.activeNetwork.networkType === 'polkadot') {
          throw new Error('AA transactions are only avaliable to ethereum networks');
        } else if (!biconomyFixtures[request.dappOrigin.activeNetwork.chainId]) {
          throw new Error('AA transaction is not avaliable to the selected network');
        } else {
          const deserializedTx = ethers.utils.parseTransaction('0x' + u8aToHex(request.payload.encoded));

          if (!deserializedTx.gasLimit || deserializedTx.gasLimit.toNumber() === 0) {
            throw new Error('GasLimit must be set on AA transactions');
          }

          const tx: IWalletTransaction = {
            data: deserializedTx.data,
            operation: request.payload.signTxType === SignTxType.AACall ? 0 : 1,
            to: deserializedTx.to,
            value: deserializedTx.value
          };

          let aaWalletAddress = account.aaWalletAddress;

          if (!aaWalletAddress) {
            await account.init();
            aaWalletAddress = account.aaWalletAddress;
          }

          const callData = await callDataExecTransaction(
            chainIdToProvider[request.dappOrigin.activeNetwork.chainId], aaWalletAddress, signer, tx, 0
          );

          const txResponse = await signer.sendTransaction({
            data: callData,
            gasLimit: deserializedTx.gasLimit.toString(),
            to: aaWalletAddress,
            value: deserializedTx.value.toString()
          }, request.dappOrigin.activeNetwork.chainId, auth);

          response = new SignTxResponse({
            dappOrigin: request.dappOrigin,
            error: err,
            payload: new SignTxResponsePayload({
              blockNumber: txResponse.blockNumber,
              gaslessTxId: gaslessTxId,
              txHash: txResponse.txHash
            }),
            userOrigin: request.userOrigin
          });
        }

        break;

      case SignTxType.Gasless:
      case SignTxType.GaslessBatch:
        if (request.dappOrigin.activeNetwork.networkType === 'polkadot') {
          throw new Error('gasless transactions are only avaliable to ethereum networks');
        } else if (!biconomyFixtures[request.dappOrigin.activeNetwork.chainId]) {
          throw new Error('gasless transaction is not avaliable to the selected network');
        } else {
          const deserializedTx = ethers.utils.parseTransaction('0x' + u8aToHex(request.payload.encoded));
          const tx = {
            data: deserializedTx.data,
            to: deserializedTx.to,
            value: deserializedTx.value
          };

          gaslessTxId = await sendBiconomyTxPayload(
            chainIdToProvider[request.dappOrigin.activeNetwork.chainId],
            tx, signer, request.payload.signTxType === SignTxType.GaslessBatch, auth
          );

          response = new SignTxResponse({
            dappOrigin: request.dappOrigin,
            error: err,
            payload: new SignTxResponsePayload({
              blockNumber: blockNumber,
              gaslessTxId: gaslessTxId,
              txHash: txHash
            }),
            userOrigin: request.userOrigin
          });
        }

        await sleep(1000);

        break;
    }

    account.lock();

    return response;
  }
}

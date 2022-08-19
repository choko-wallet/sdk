// Copyright 2021-2022 @choko-wallet/request-handler authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString, Version } from '@choko-wallet/core/types';

import { ApiPromise, WsProvider } from '@polkadot/api';
import Keyring from '@polkadot/keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { padSize, u8aToHex, unpadSize } from '@skyekiwi/util';

import { deserializeRequestError, IDappDescriptor, IPayload, IRequest, IRequestHandlerDescriptor, IResponse, RequestError, RequestErrorSerializedLength, serializeRequestError, UserAccount } from '@choko-wallet/core';
import { DappDescriptor } from '@choko-wallet/core/dapp';
import { CURRENT_VERSION } from '@choko-wallet/core/types';
import { xxHash } from '@choko-wallet/core/util';

export const signTxHash: HexString = u8aToHex(xxHash('signTx'));

export class SignTxRequestPayload implements IPayload {
  public readonly encoded: Uint8Array;
  public readonly version: Version;

  constructor (config: {
    encoded: Uint8Array,
    version?: Version
  }) {
    const { encoded } = config;

    if (encoded.length >= 512) {
      throw new Error('message too long');
    }

    this.encoded = encoded;
    this.version = config.version || CURRENT_VERSION;
  }

  public static serializedLength (): number {
    return 512 + 4 + 2;
  }

  public build (): Uint8Array {
    const res = new Uint8Array(SignTxRequestPayload.serializedLength());

    res.set(padSize(this.encoded.length), 0);
    res.set(this.encoded, 4);
    res.set([this.version, this.version], 4 + 512);

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
      version: data[4 + 512]
    });
  }
}

export class SignTxResponsePayload implements IPayload {
  public readonly txHash: Uint8Array;
  public readonly version: Version;

  constructor (config: {
    txHash: Uint8Array,
    version?: Version
  }) {
    const { txHash } = config;

    this.txHash = txHash;
    this.version = config.version || CURRENT_VERSION;
  }

  public static serializedLength (): number {
    return 32 + // txHash size for both substrate & ethereum
      2; // version
  }

  public build (): Uint8Array {
    const res = new Uint8Array(SignTxResponsePayload.serializedLength());

    res.set(this.txHash, 0);
    res.set([this.version, this.version], 32);

    return res;
  }

  public static parse (data: Uint8Array): SignTxResponsePayload {
    if (data.length !== SignTxResponsePayload.serializedLength()) {
      throw new Error('invalid length');
    }

    return new SignTxResponsePayload({
      txHash: data.slice(0, 32),
      version: data[32]
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

  public async requestHandler (request: SignTxRequest, account: UserAccount): Promise<SignTxResponse> {
    await cryptoWaitReady();

    let err = RequestError.NoError;

    if (account.isLocked) {
      err = RequestError.AccountLocked;
    }

    const kr = (new Keyring({
      type: account.keyType
    })).addFromUri('0x' + u8aToHex(account.privateKey));

    const rawProvider = request.dappOrigin.activeNetwork.defaultProvider;
    const provider = new WsProvider(rawProvider);
    const api = await ApiPromise.create({ provider: provider });
    const txHash = await api.tx(request.payload.encoded).signAndSend(kr);

    await provider.disconnect();

    const response = new SignTxResponse({
      dappOrigin: request.dappOrigin,
      error: err,
      payload: new SignTxResponsePayload({
        txHash: txHash
      }),
      userOrigin: request.userOrigin
    });

    return response;
  }
}

// Copyright 2021-2022 @choko-wallet/request-handler authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IDappDescriptor } from '@choko-wallet/core';
import type { HexString, Version } from '@choko-wallet/core/types';

import Keyring from '@polkadot/keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { stringToU8a, u8aToHex } from '@skyekiwi/util';

import { IPayload, IRequest, IRequestError, IRequestHandlerDescriptor, IResponse, UserAccount } from '@choko-wallet/core';
import { DappDescriptor } from '@choko-wallet/core/dapp';
import { CURRENT_VERSION } from '@choko-wallet/core/types';
import { xxHash } from '@choko-wallet/core/util';

export class SignMessageError implements IRequestError {
  reason: Uint8Array;

  constructor (config: {
    reason: Uint8Array
  }) {
    this.reason = config.reason;
  }
}

export class SignMessageRequestPayload implements IPayload {
  public readonly message: Uint8Array;

  constructor (config: {
    message: Uint8Array,
  }) {
    const { message } = config;

    this.message = message;
  }

  public build (): Uint8Array {
    return this.message;
  }

  public static parse (data: Uint8Array): SignMessageRequestPayload {
    return new SignMessageRequestPayload({
      message: data
    });
  }
}

export class SignMessageResponsePayload implements IPayload {
  public readonly singature: Uint8Array;

  constructor (config: {
    singature: Uint8Array,
  }) {
    const { singature } = config;

    this.singature = singature;
  }

  public build (): Uint8Array {
    return this.singature;
  }

  public static parse (data: Uint8Array): SignMessageResponsePayload {
    return new SignMessageResponsePayload({
      singature: data
    });
  }
}

export class SignMessageRequest implements IRequest {
  dappOrigin: IDappDescriptor;
  userOrigin: UserAccount;

  type: HexString;

  isRemote: boolean; // do we need to interact with blockchain?
  payload: SignMessageRequestPayload;

  version: Version;

  constructor (config: {
    dappOrigin: IDappDescriptor,
    payload: SignMessageRequestPayload,
    userOrigin: UserAccount,
  }) {
    const { dappOrigin, payload, userOrigin } = config;

    if (!userOrigin.isLocked) {
      throw new Error('userOrigin is not LOCKED. Aborting. ');
    }

    this.dappOrigin = dappOrigin;
    this.userOrigin = userOrigin;

    this.payload = payload;
    this.type = u8aToHex(xxHash('signMessage'));
    this.isRemote = false;

    this.version = CURRENT_VERSION;
  }

  public validatePayload (): boolean {
    try {
      this.payload.build();

      return true;
    } catch (e) {
      return false;
    }
  }

  public serialize (): Uint8Array {
    const length = (68 + 68 + 16 + 1) + // DappOrigin
      (36) + // UserAccount
      (this.payload.build().length); // Payload

    const res = new Uint8Array(length);

    res.set(this.dappOrigin.serialize(), 0);
    res.set(this.userOrigin.serialize(), 68);
    res.set(this.payload.build(), 68 + 36);

    return res;
  }

  public static deserialize (data: Uint8Array): SignMessageRequest {
    const dappOrigin = DappDescriptor.deserialize(data.slice(0, 68));
    const userOrigin = UserAccount.deserialize(data.slice(68, 68 + 36));
    const payload = SignMessageRequestPayload.parse(data.slice(68 + 36 + 16 + 1 + 1));

    return new SignMessageRequest({
      dappOrigin: dappOrigin,
      payload: payload,
      userOrigin: userOrigin
    });
  }
}

export class SignMessageResponse implements IResponse {
  dappOrigin: IDappDescriptor;
  userOrigin: UserAccount;

  type: HexString;

  isSuccessful: boolean;

  error?: SignMessageError;
  payload: SignMessageResponsePayload;

  version: Version;

  constructor (config: {
    dappOrigin: IDappDescriptor,
    userOrigin: UserAccount,

    isSuccessful: boolean,

    payload: SignMessageResponsePayload,
    error?: SignMessageError,
  }) {
    const { dappOrigin, error, isSuccessful, payload, userOrigin } = config;

    this.dappOrigin = dappOrigin;
    this.userOrigin = userOrigin;
    this.isSuccessful = isSuccessful;
    this.payload = payload;
    this.type = u8aToHex(xxHash('signMessage'));
    this.version = CURRENT_VERSION;

    if (error) {
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

  public serialize (): Uint8Array {
    const length = (68 + 68 + 16 + 1) + // DappOrigin
      (36) + // UserAccount
      (1) + // isSuccessful
      (this.payload.build().length) + // Payload
      (this.error.reason.length); // Error

    const res = new Uint8Array(length);

    res.set(this.dappOrigin.serialize(), 0);
    res.set(this.userOrigin.serialize(), 68);
    res.set([this.isSuccessful ? 1 : 0, this.isSuccessful ? 1 : 0], 68 + 36);
    res.set(this.payload.build(), 68 + 36 + 1);
    res.set(this.error.reason, 68 + 36 + 1 + this.payload.build().length);

    return res;
  }

  public static deserialize (data: Uint8Array): SignMessageResponse {
    const dappOrigin = DappDescriptor.deserialize(data.slice(0, 68));
    const userOrigin = UserAccount.deserialize(data.slice(68, 68 + 36));

    const isSuccessful = data[68 + 36] === 1;

    const payload = SignMessageResponsePayload.parse(data.slice(68 + 36 + 1 + 1));
    const error = new SignMessageError({
      reason: data.slice(68 + 36 + 1 + 1 + payload.build().length)
    });

    return new SignMessageResponse({
      dappOrigin: dappOrigin,
      error: error,
      isSuccessful: isSuccessful,
      payload: payload,
      userOrigin: userOrigin
    });
  }
}

export class SignMessageDescriptor implements IRequestHandlerDescriptor {
  description: string;
  name: string;

  userApprovalRequired: boolean; // do we send the request to wallet approval?

  version: Version;

  constructor () {
    this.description = 'Sign a Message for user';
    this.name = 'signMessage';

    this.userApprovalRequired = true;

    this.version = CURRENT_VERSION;
  }

  public async requestHandler (request: SignMessageRequest, account: UserAccount): Promise<SignMessageResponse> {
    await cryptoWaitReady();

    let err: SignMessageError;

    if (account.isLocked) {
      err = new SignMessageError({
        reason: stringToU8a('Account is locked')
      });
    }

    const kr = (new Keyring({
      type: account.keyType
    })).addFromUri('0x' + u8aToHex(account.privateKey));

    const response = new SignMessageResponse({
      dappOrigin: request.dappOrigin,
      error: err,
      isSuccessful: false,
      payload: new SignMessageResponsePayload({
        singature: kr.sign(request.payload.message)
      }),
      userOrigin: request.userOrigin

    });

    return response;
  }
}

export const signMessageHash: HexString = u8aToHex(xxHash('signMessage'));

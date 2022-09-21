// Copyright 2021-2022 @choko-wallet/request-handler authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString, KeypairType, Version } from '@choko-wallet/core/types';

import Keyring from '@polkadot/keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { padSize, u8aToHex, unpadSize } from '@skyekiwi/util';

import { DappDescriptor, deserializeRequestError, IPayload, IRequest, IRequestHandlerDescriptor, IResponse, RequestError, RequestErrorSerializedLength, serializeRequestError, UserAccount } from '@choko-wallet/core';
import { CURRENT_VERSION } from '@choko-wallet/core/types';
import { keypairTypeNumberToString, keypairTypeStringToNumber, xxHash } from '@choko-wallet/core/util';

export const signMessageHash: HexString = u8aToHex(xxHash('signMessage'));

export class SignMessageRequestPayload implements IPayload {
  public readonly message: Uint8Array;
  public readonly version: Version;

  constructor (config: {
    message: Uint8Array,
    version?: Version
  }) {
    const { message } = config;

    if (message.length >= 512) {
      throw new Error('message too long');
    }

    this.message = message;
    this.version = config.version || CURRENT_VERSION;
  }

  public static serializedLength (): number {
    return 512 + 4 + 2;
  }

  public build (): Uint8Array {
    const res = new Uint8Array(SignMessageRequestPayload.serializedLength());

    res.set(padSize(this.message.length), 0);
    res.set(this.message, 4);
    res.set([this.version, this.version], 4 + 512);

    return res;
  }

  public static parse (data: Uint8Array): SignMessageRequestPayload {
    if (data.length !== SignMessageRequestPayload.serializedLength()) {
      throw new Error('invalid length');
    }

    const msgLength = unpadSize(data.slice(0, 4));
    const msg = data.slice(4, 4 + msgLength);

    return new SignMessageRequestPayload({
      message: msg,
      version: data[4 + 512]
    });
  }
}

export class SignMessageResponsePayload implements IPayload {
  public readonly signature: Uint8Array;
  public readonly keyType: KeypairType;
  public readonly version: Version;

  constructor (config: {
    signature: Uint8Array,
    keyType: KeypairType
    version?: Version
  }) {
    const { keyType, signature } = config;

    this.signature = signature;
    this.keyType = keyType;
    this.version = config.version || CURRENT_VERSION;
  }

  public static serializedLength (): number {
    return 1 + // keytype
      65 + // sig = pad a zero byte for sr25519 & ed25519
      2; // version
  }

  public build (): Uint8Array {
    const res = new Uint8Array(SignMessageResponsePayload.serializedLength());

    res.set([keypairTypeStringToNumber(this.keyType)], 0);

    if (this.keyType === 'sr25519' || this.keyType === 'ed25519') {
      if (this.signature.length !== 64) {
        throw new Error('invalid length');
      }

      res.set([0], 1);
      res.set(this.signature, 2);
    } else {
      if (this.signature.length !== 65) {
        throw new Error('invalid length');
      }

      res.set(this.signature, 1);
    }

    res.set([this.version, this.version], 1 + 65);

    return res;
  }

  public static parse (data: Uint8Array): SignMessageResponsePayload {
    if (data.length !== SignMessageResponsePayload.serializedLength()) {
      throw new Error('invalid length');
    }

    const keyType = keypairTypeNumberToString(data[0]);
    let signature = data.slice(1, 1 + 65);

    if (keyType === 'sr25519' || keyType === 'ed25519') {
      signature = signature.slice(1);
    }

    const version = data[1 + 65];

    return new SignMessageResponsePayload({
      keyType, signature, version
    });
  }
}

export class SignMessageRequest implements IRequest {
  dappOrigin: DappDescriptor;
  userOrigin: UserAccount;

  type: HexString;

  isRemote: boolean; // do we need to interact with blockchain?
  payload: SignMessageRequestPayload;

  version: Version;

  constructor (config: {
    dappOrigin: DappDescriptor,
    payload: SignMessageRequestPayload,
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
    this.type = signMessageHash;
    this.isRemote = false;

    this.version = config.version || CURRENT_VERSION;
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
    return DappDescriptor.serializedLength() + // version
      UserAccount.serializedLength() + // type
      SignMessageRequestPayload.serializedLength() +
      2; // version
  }

  public serialize (): Uint8Array {
    const res = new Uint8Array(SignMessageRequest.serializedLength());

    res.set(this.dappOrigin.serialize(), 0);
    res.set(this.userOrigin.serialize(), DappDescriptor.serializedLength());
    res.set(this.payload.build(), DappDescriptor.serializedLength() + UserAccount.serializedLength());
    res.set([this.version, this.version],
      DappDescriptor.serializedLength() + UserAccount.serializedLength() + SignMessageRequestPayload.serializedLength()
    );

    return res;
  }

  public static deserialize (data: Uint8Array): SignMessageRequest {
    if (data.length !== SignMessageRequest.serializedLength()) {
      throw new Error('invalid length');
    }

    const dappOrigin = DappDescriptor.deserialize(data.slice(0, DappDescriptor.serializedLength()));
    const userOrigin = UserAccount.deserialize(data.slice(DappDescriptor.serializedLength(),
      DappDescriptor.serializedLength() + UserAccount.serializedLength()
    ));
    const payload = SignMessageRequestPayload.parse(data.slice(
      DappDescriptor.serializedLength() + UserAccount.serializedLength(),
      DappDescriptor.serializedLength() + UserAccount.serializedLength() + SignMessageRequestPayload.serializedLength()
    ));
    const version = data[DappDescriptor.serializedLength() + UserAccount.serializedLength() + SignMessageRequestPayload.serializedLength()];

    return new SignMessageRequest({
      dappOrigin: dappOrigin,
      payload: payload,
      userOrigin: userOrigin,
      version: version
    });
  }
}

export class SignMessageResponse implements IResponse {
  dappOrigin: DappDescriptor;
  userOrigin: UserAccount;

  type: HexString;

  isSuccessful: boolean;

  error?: RequestError;
  payload: SignMessageResponsePayload;

  version: Version;

  constructor (config: {
    dappOrigin: DappDescriptor,
    userOrigin: UserAccount,

    payload: SignMessageResponsePayload,
    error?: RequestError,
    version?: Version,
  }) {
    const { dappOrigin, error, payload, userOrigin } = config;

    this.dappOrigin = dappOrigin;
    this.userOrigin = userOrigin;
    this.payload = payload;
    this.type = signMessageHash;
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
      SignMessageResponsePayload.serializedLength() +
      RequestErrorSerializedLength +
      2; // version
  }

  public serialize (): Uint8Array {
    const res = new Uint8Array(SignMessageResponse.serializedLength());

    res.set(this.dappOrigin.serialize(), 0);
    res.set(this.userOrigin.serialize(), DappDescriptor.serializedLength());
    res.set(this.payload.build(), DappDescriptor.serializedLength() + UserAccount.serializedLength());
    res.set(serializeRequestError(this.error),
      DappDescriptor.serializedLength() + UserAccount.serializedLength() +
      SignMessageResponsePayload.serializedLength());
    res.set([this.version, this.version],
      DappDescriptor.serializedLength() + UserAccount.serializedLength() +
      SignMessageResponsePayload.serializedLength() + RequestErrorSerializedLength);

    return res;
  }

  public static deserialize (data: Uint8Array): SignMessageResponse {
    if (data.length !== SignMessageResponse.serializedLength()) {
      throw new Error('invalid length');
    }

    const dappOrigin = DappDescriptor.deserialize(data.slice(0, DappDescriptor.serializedLength()));
    const userOrigin = UserAccount.deserialize(data.slice(DappDescriptor.serializedLength(),
      DappDescriptor.serializedLength() + UserAccount.serializedLength()
    ));

    const payload = SignMessageResponsePayload.parse(data.slice(
      DappDescriptor.serializedLength() + UserAccount.serializedLength(),
      DappDescriptor.serializedLength() + UserAccount.serializedLength() + SignMessageResponsePayload.serializedLength()
    ));
    const error = deserializeRequestError(data.slice(
      DappDescriptor.serializedLength() + UserAccount.serializedLength() + SignMessageResponsePayload.serializedLength(),
      DappDescriptor.serializedLength() + UserAccount.serializedLength() + SignMessageResponsePayload.serializedLength() + RequestErrorSerializedLength
    ));
    const version = data[DappDescriptor.serializedLength() + UserAccount.serializedLength() +
      SignMessageResponsePayload.serializedLength() + RequestErrorSerializedLength];

    return new SignMessageResponse({
      dappOrigin: dappOrigin,
      error: error,
      payload: payload,
      userOrigin: userOrigin,
      version: version
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

    let err = RequestError.NoError;

    if (account.isLocked) {
      err = RequestError.AccountLocked;
    }

    const kr = (new Keyring({
      type: account.option.keyType
    })).addFromUri('0x' + u8aToHex(account.privateKey));

    const response = new SignMessageResponse({
      dappOrigin: request.dappOrigin,
      error: err,
      payload: new SignMessageResponsePayload({
        keyType: account.option.keyType,
        signature: kr.sign(request.payload.message)
      }),
      userOrigin: request.userOrigin
    });

    return response;
  }
}

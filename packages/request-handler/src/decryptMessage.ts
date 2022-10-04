// Copyright 2021-2022 @choko-wallet/request-handler authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString, KeypairType, Version } from '@choko-wallet/core/types';

import { cryptoWaitReady } from '@polkadot/util-crypto';
import { AsymmetricEncryption } from '@skyekiwi/crypto';
import { padSize, u8aToHex, unpadSize } from '@skyekiwi/util';

import { DappDescriptor, deserializeRequestError, IPayload, IRequest, IRequestHandlerDescriptor, IResponse, RequestError, RequestErrorSerializedLength, serializeRequestError, UserAccount } from '@choko-wallet/core';
import { CURRENT_VERSION } from '@choko-wallet/core/types';
import { keypairTypeNumberToString, keypairTypeStringToNumber, xxHash } from '@choko-wallet/core/util';

export const decryptMessageHash: HexString = u8aToHex(xxHash('decryptMessage'));

export class DecryptMessageRequestPayload implements IPayload {
  public readonly keyType: KeypairType;
  public readonly message: Uint8Array;
  public readonly receiptPublicKey: Uint8Array;
  public readonly version: Version;

  constructor (config: {
    keyType: KeypairType,
    message: Uint8Array,
    receiptPublicKey: Uint8Array,
    version?: Version
  }) {
    const { keyType, message, receiptPublicKey } = config;

    if (message.length >= 512) {
      throw new Error('message too long');
    }

    if (receiptPublicKey.length !== 32) {
      throw new Error(`receiptPublicKey length is ${receiptPublicKey.length}, which should be 32`);
    }

    this.message = message;
    this.receiptPublicKey = receiptPublicKey;
    this.keyType = keyType;
    this.version = config.version || CURRENT_VERSION;
  }

  public static serializedLength (): number {
    return 1 + // keyType
    512 + 4 + // message length + message size
    32 + // receiptPublicKey
    1; // version;
  }

  public build (): Uint8Array {
    const res = new Uint8Array(DecryptMessageRequestPayload.serializedLength());

    res.set([keypairTypeStringToNumber(this.keyType)], 0);
    res.set(padSize(this.message.length), 1);
    res.set(this.message, 5);
    res.set(this.receiptPublicKey, 1 + 4 + 512);
    res.set([this.version], 4 + 512 + 32 + 1);

    return res;
  }

  public static parse (data: Uint8Array): DecryptMessageRequestPayload {
    if (data.length !== DecryptMessageRequestPayload.serializedLength()) {
      throw new Error('invalid length');
    }

    const msgLength = unpadSize(data.slice(1, 1 + 4));
    const msg = data.slice(1 + 4, 1 + 4 + msgLength);

    return new DecryptMessageRequestPayload({
      keyType: keypairTypeNumberToString(data[0]),
      message: msg,
      receiptPublicKey: data.slice(1 + 4 + 512, 1 + 4 + 512 + 32),
      version: data[4 + 512 + 32 + 1]
    });
  }
}

export class DecryptMessageResponsePayload implements IPayload {
  public readonly message: Uint8Array;
  public readonly version: Version;

  constructor (config: {
    message: Uint8Array,
    version?: Version
  }) {
    const { message } = config;

    if (message.length > 512) {
      throw new Error('message too long');
    }

    this.message = message;
    this.version = config.version || CURRENT_VERSION;
  }

  public static serializedLength (): number {
    return 4 + 512 + // re-encrypted message
      1; // version
  }

  public build (): Uint8Array {
    const res = new Uint8Array(DecryptMessageResponsePayload.serializedLength());

    res.set(padSize(this.message.length), 0);
    res.set(this.message, 4);
    res.set([this.version], 4 + 512);

    return res;
  }

  public static parse (data: Uint8Array): DecryptMessageResponsePayload {
    if (data.length !== DecryptMessageResponsePayload.serializedLength()) {
      throw new Error('invalid length');
    }

    const msgLength = unpadSize(data.slice(0, 4));
    const msg = data.slice(4, 4 + msgLength);

    return new DecryptMessageResponsePayload({
      message: msg, version: data[4 + 512]
    });
  }
}

export class DecryptMessageRequest implements IRequest {
  dappOrigin: DappDescriptor;
  userOrigin: UserAccount;

  type: HexString;

  isRemote: boolean; // do we need to interact with blockchain?
  payload: DecryptMessageRequestPayload;

  version: Version;

  constructor (config: {
    dappOrigin: DappDescriptor,
    payload: DecryptMessageRequestPayload,
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
    this.type = decryptMessageHash;
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
    return DappDescriptor.serializedLength() +
      UserAccount.serializedLength() +
      DecryptMessageRequestPayload.serializedLength() +
      2; // version
  }

  public serialize (): Uint8Array {
    const res = new Uint8Array(DecryptMessageRequest.serializedLength());

    res.set(this.dappOrigin.serialize(), 0);
    res.set(this.userOrigin.serialize(), DappDescriptor.serializedLength());
    res.set(this.payload.build(), DappDescriptor.serializedLength() + UserAccount.serializedLength());
    res.set([this.version, this.version],
      DappDescriptor.serializedLength() + UserAccount.serializedLength() + DecryptMessageRequestPayload.serializedLength()
    );

    return res;
  }

  public static deserialize (data: Uint8Array): DecryptMessageRequest {
    if (data.length !== DecryptMessageRequest.serializedLength()) {
      throw new Error('invalid length');
    }

    const dappOrigin = DappDescriptor.deserialize(data.slice(0, DappDescriptor.serializedLength()));
    const userOrigin = UserAccount.deserialize(data.slice(DappDescriptor.serializedLength(),
      DappDescriptor.serializedLength() + UserAccount.serializedLength()
    ));
    const payload = DecryptMessageRequestPayload.parse(data.slice(
      DappDescriptor.serializedLength() + UserAccount.serializedLength(),
      DappDescriptor.serializedLength() + UserAccount.serializedLength() + DecryptMessageRequestPayload.serializedLength()
    ));
    const version = data[DappDescriptor.serializedLength() + UserAccount.serializedLength() + DecryptMessageRequestPayload.serializedLength()];

    return new DecryptMessageRequest({
      dappOrigin: dappOrigin,
      payload: payload,
      userOrigin: userOrigin,
      version: version
    });
  }
}

export class DecryptMessageResponse implements IResponse {
  dappOrigin: DappDescriptor;
  userOrigin: UserAccount;

  type: HexString;

  isSuccessful: boolean;

  error?: RequestError;
  payload: DecryptMessageResponsePayload;

  version: Version;

  constructor (config: {
    dappOrigin: DappDescriptor,
    userOrigin: UserAccount,

    payload: DecryptMessageResponsePayload,
    error?: RequestError,
    version?: Version,
  }) {
    const { dappOrigin, error, payload, userOrigin } = config;

    this.dappOrigin = dappOrigin;
    this.userOrigin = userOrigin;
    this.payload = payload;
    this.type = decryptMessageHash;
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
      DecryptMessageResponsePayload.serializedLength() +
      RequestErrorSerializedLength +
      2; // version
  }

  public serialize (): Uint8Array {
    const res = new Uint8Array(DecryptMessageResponse.serializedLength());

    res.set(this.dappOrigin.serialize(), 0);
    res.set(this.userOrigin.serialize(), DappDescriptor.serializedLength());
    res.set(this.payload.build(), DappDescriptor.serializedLength() + UserAccount.serializedLength());
    res.set(serializeRequestError(this.error),
      DappDescriptor.serializedLength() + UserAccount.serializedLength() +
      DecryptMessageResponsePayload.serializedLength());
    res.set([this.version, this.version],
      DappDescriptor.serializedLength() + UserAccount.serializedLength() +
      DecryptMessageResponsePayload.serializedLength() + RequestErrorSerializedLength);

    return res;
  }

  public static deserialize (data: Uint8Array): DecryptMessageResponse {
    if (data.length !== DecryptMessageResponse.serializedLength()) {
      throw new Error('invalid length');
    }

    const dappOrigin = DappDescriptor.deserialize(data.slice(0, DappDescriptor.serializedLength()));
    const userOrigin = UserAccount.deserialize(data.slice(DappDescriptor.serializedLength(),
      DappDescriptor.serializedLength() + UserAccount.serializedLength()
    ));

    const payload = DecryptMessageResponsePayload.parse(data.slice(
      DappDescriptor.serializedLength() + UserAccount.serializedLength(),
      DappDescriptor.serializedLength() + UserAccount.serializedLength() + DecryptMessageResponsePayload.serializedLength()
    ));
    const error = deserializeRequestError(data.slice(
      DappDescriptor.serializedLength() + UserAccount.serializedLength() + DecryptMessageResponsePayload.serializedLength(),
      DappDescriptor.serializedLength() + UserAccount.serializedLength() + DecryptMessageResponsePayload.serializedLength() + RequestErrorSerializedLength
    ));
    const version = data[DappDescriptor.serializedLength() + UserAccount.serializedLength() +
      DecryptMessageResponsePayload.serializedLength() + RequestErrorSerializedLength];

    return new DecryptMessageResponse({
      dappOrigin: dappOrigin,
      error: error,
      payload: payload,
      userOrigin: userOrigin,
      version: version
    });
  }
}

export class DecryptMessageDescriptor implements IRequestHandlerDescriptor {
  description: string;
  name: string;

  userApprovalRequired: boolean; // do we send the request to wallet approval?

  version: Version;

  constructor () {
    this.description = 'Decrypt & Re-Encrypt a Message for user';
    this.name = 'DecryptMessage';

    this.userApprovalRequired = true;

    this.version = CURRENT_VERSION;
  }

  public async requestHandler (request: DecryptMessageRequest, account: UserAccount): Promise<DecryptMessageResponse> {
    await cryptoWaitReady();

    let err = RequestError.NoError;

    if (account.isLocked) {
      err = RequestError.AccountLocked;
    }

    const keyType = request.payload.keyType;
    const message = request.payload.message;
    const receiptPublicKey = request.payload.receiptPublicKey;

    let reEncryptedMessage: Uint8Array;

    if (account.option.keyType !== keyType || (keyType !== 'sr25519' && keyType !== 'ed25519')) {
      err = RequestError.Unknown;
    }

    if (err === RequestError.NoError) {
      try {
        // 1. get the original message
        const clearTextMessage = AsymmetricEncryption.decryptWithCurveType(
          keyType as 'sr25519' | 'ed25519', // TODO: fixme
          account.privateKey, message
        );

        // 2. now re-encrypt the message
        // We always re-encrypt with ECDH on Curve25519!
        reEncryptedMessage = AsymmetricEncryption.encrypt(clearTextMessage, receiptPublicKey);
      } catch (e) {
        err = RequestError.Unexpected;
      }
    }

    const response = new DecryptMessageResponse({
      dappOrigin: request.dappOrigin,
      error: err,
      payload: new DecryptMessageResponsePayload({
        message: reEncryptedMessage
      }),
      userOrigin: request.userOrigin
    });

    return response;
  }
}

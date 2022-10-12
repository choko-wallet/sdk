// Copyright 2021-2022 @choko-wallet/request-handler authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString, Version } from '@choko-wallet/core/types';

import { cryptoWaitReady } from '@polkadot/util-crypto';
import { u8aToHex } from '@skyekiwi/util';

import { deserializeRequestError, IDappDescriptor, IPayload, IRequest, IRequestHandlerDescriptor, IResponse, RequestError, RequestErrorSerializedLength, serializeRequestError, UserAccount } from '@choko-wallet/core';
import { DappDescriptor } from '@choko-wallet/core/dapp';
import { CURRENT_VERSION } from '@choko-wallet/core/types';
import { xxHash } from '@choko-wallet/core/util';

export const connectDappHash: HexString = u8aToHex(xxHash('connectDapp'));

// ConnectDappRequestPayload contains nothing but the request version
export class ConnectDappRequestPayload implements IPayload {
  public readonly version: Version;

  constructor (config: {
    version?: Version
  }) {
    this.version = config.version || CURRENT_VERSION;
  }

  public static serializedLength (): number {
    return 2;
  }

  public build (): Uint8Array {
    return new Uint8Array([this.version, this.version]);
  }

  public static parse (data: Uint8Array): ConnectDappRequestPayload {
    return new ConnectDappRequestPayload({
      version: data[0]
    });
  }
}

// ConnectDappResponsePayload contains a serialized UserAccount
export class ConnectDappResponsePayload implements IPayload {
  public readonly userAccount: UserAccount;
  public readonly version: Version;

  constructor (config: {
    userAccount: UserAccount,
    version?: Version
  }) {
    const { userAccount } = config;

    if (!userAccount.isLocked) {
      throw new Error('User account is not locked');
    }

    this.userAccount = userAccount;
    this.version = config.version || CURRENT_VERSION;
  }

  public static serializedLength (): number {
    return UserAccount.serializedLength() + 2;
  }

  public build (): Uint8Array {
    const res = new Uint8Array(UserAccount.serializedLength() + 2);

    res.set(this.userAccount.serialize(), 0);
    res.set([this.version, this.version], UserAccount.serializedLength());

    return res;
  }

  public static parse (data: Uint8Array): ConnectDappResponsePayload {
    return new ConnectDappResponsePayload({
      userAccount: UserAccount.deserialize(data.slice(0, UserAccount.serializedLength())),
      version: data[UserAccount.serializedLength()]
    });
  }
}

export class ConnectDappRequest implements IRequest {
  dappOrigin: IDappDescriptor;
  userOrigin: UserAccount;

  type: HexString;

  isRemote: boolean; // do we need to interact with blockchain?
  payload: ConnectDappRequestPayload;

  version: Version;

  constructor (config: {
    dappOrigin: IDappDescriptor,
    payload: ConnectDappRequestPayload,
    userOrigin: UserAccount,

    version?: Version
  }) {
    const { dappOrigin, payload, userOrigin } = config;

    if (!userOrigin.isLocked) {
      throw new Error('userOrigin is not LOCKED. Aborting. ');
    }

    this.dappOrigin = dappOrigin;
    this.userOrigin = userOrigin;

    this.payload = payload;
    this.type = connectDappHash;
    this.isRemote = false; // We do not need to interact with blockchain with this IRequest

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
      ConnectDappRequestPayload.serializedLength() +
      2; // Version
  }

  public serialize (): Uint8Array {
    const res = new Uint8Array(ConnectDappRequest.serializedLength());

    res.set(this.dappOrigin.serialize(), 0);
    res.set(this.userOrigin.serialize(), DappDescriptor.serializedLength());
    res.set(this.payload.build(), DappDescriptor.serializedLength() + UserAccount.serializedLength());
    res.set([this.version, this.version],
      DappDescriptor.serializedLength() + UserAccount.serializedLength() + ConnectDappRequestPayload.serializedLength());

    return res;
  }

  public static deserialize (data: Uint8Array): ConnectDappRequest {
    const dappOrigin = DappDescriptor.deserialize(data.slice(0, DappDescriptor.serializedLength()));
    const userOrigin = UserAccount.deserialize(data.slice(DappDescriptor.serializedLength(),
      DappDescriptor.serializedLength() + UserAccount.serializedLength()));
    const payload = ConnectDappRequestPayload.parse(
      data.slice(DappDescriptor.serializedLength() + UserAccount.serializedLength(),
        DappDescriptor.serializedLength() + UserAccount.serializedLength() + ConnectDappRequestPayload.serializedLength())
    );
    const version = data[DappDescriptor.serializedLength() + UserAccount.serializedLength() +
        ConnectDappRequestPayload.serializedLength()];

    return new ConnectDappRequest({
      dappOrigin: dappOrigin,
      payload: payload,
      userOrigin: userOrigin,
      version: version
    });
  }
}

export class ConnectDappResponse implements IResponse {
  dappOrigin: IDappDescriptor;
  userOrigin: UserAccount;

  type: HexString;

  isSuccessful: boolean;

  error?: RequestError;
  payload: ConnectDappResponsePayload;

  version: Version;

  constructor (config: {
    dappOrigin: IDappDescriptor,
    userOrigin: UserAccount,

    payload: ConnectDappResponsePayload,
    error?: RequestError,
    version?: Version
  }) {
    const { dappOrigin, error, payload, userOrigin } = config;

    this.dappOrigin = dappOrigin;
    this.userOrigin = userOrigin;
    this.payload = payload;
    this.type = connectDappHash;
    this.version = config.version || CURRENT_VERSION;

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
      ConnectDappResponsePayload.serializedLength() +
      RequestErrorSerializedLength + // error
      2; // Version
  }

  public serialize (): Uint8Array {
    const res = new Uint8Array(ConnectDappResponse.serializedLength());

    res.set(this.dappOrigin.serialize(), 0);
    res.set(this.userOrigin.serialize(), DappDescriptor.serializedLength());
    res.set(this.payload.build(),
      DappDescriptor.serializedLength() + UserAccount.serializedLength());

    res.set(serializeRequestError(this.error),
      DappDescriptor.serializedLength() + UserAccount.serializedLength() +
      ConnectDappResponsePayload.serializedLength());
    res.set([this.version, this.version],
      DappDescriptor.serializedLength() + UserAccount.serializedLength() +
      ConnectDappResponsePayload.serializedLength() + RequestErrorSerializedLength);

    return res;
  }

  public static deserialize (data: Uint8Array): ConnectDappResponse {
    const dappOrigin = DappDescriptor.deserialize(data.slice(0, DappDescriptor.serializedLength()));

    const userOrigin = UserAccount.deserialize(data.slice(
      DappDescriptor.serializedLength(),
      DappDescriptor.serializedLength() + UserAccount.serializedLength()
    ));

    const payload = ConnectDappResponsePayload.parse(data.slice(
      DappDescriptor.serializedLength() + UserAccount.serializedLength(),
      DappDescriptor.serializedLength() + UserAccount.serializedLength() + ConnectDappResponsePayload.serializedLength()
    ));

    const error = deserializeRequestError(data.slice(
      DappDescriptor.serializedLength() + UserAccount.serializedLength() + ConnectDappResponsePayload.serializedLength(),
      DappDescriptor.serializedLength() + UserAccount.serializedLength() + ConnectDappResponsePayload.serializedLength() + RequestErrorSerializedLength
    ));

    const version = data[
      DappDescriptor.serializedLength() + UserAccount.serializedLength() +
      ConnectDappResponsePayload.serializedLength() + RequestErrorSerializedLength
    ];

    return new ConnectDappResponse({
      dappOrigin: dappOrigin,
      error: error,
      payload: payload,
      userOrigin: userOrigin,
      version: version
    });
  }
}

export class ConnectDappDescriptor implements IRequestHandlerDescriptor {
  description: string;
  name: string;

  userApprovalRequired: boolean; // do we send the request to wallet approval?

  version: Version;

  constructor () {
    this.description = 'connect Dapp to wallet and request for current user account';
    this.name = 'connectDapp';

    this.userApprovalRequired = true;

    this.version = CURRENT_VERSION;
  }

  public async requestHandler (request: ConnectDappRequest, account: UserAccount): Promise<ConnectDappResponse> {
    await cryptoWaitReady();

    let err = RequestError.NoError;

    if (account.isLocked) {
      err = RequestError.AccountLocked;
    }

    // unlike Rust where we can use account.clone(), JS might use a pointer to the original obj.
    // Therefore, we construct another account a-fresh
    const userAccount = new UserAccount(account.option);

    userAccount.publicKey = account.publicKey;

    const response = new ConnectDappResponse({
      dappOrigin: request.dappOrigin,
      error: err,
      payload: new ConnectDappResponsePayload({
        userAccount: userAccount
      }),
      userOrigin: request.userOrigin
    });

    return response;
  }
}

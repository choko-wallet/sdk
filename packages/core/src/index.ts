// Copyright 2021-2022 @choko-wallet/sdk authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AccountOption, IAccountOption, ILockedPrivateKey, IUserAccount, IUserAccountInfo, LockedPrivateKey, UserAccount } from './account';
import { Cipher } from './cipher';
import { DappDescriptor, IDappDescriptor } from './dapp';
import { deserializeRequestError, mapRequestErrorToString, RequestError, RequestErrorSerializedLength, serializeRequestError } from './error';
import { INetwork, KnownNetworks, Network } from './network';
import { IPayload, IRequest, IRequestHandlerDescriptor, IResponse } from './requestHandler';

export type {
  ILockedPrivateKey, IUserAccountInfo, IUserAccount, IAccountOption,
  IDappDescriptor,
  INetwork, KnownNetworks,
  IPayload, IRequestHandlerDescriptor, IRequest, IResponse
};

export {
  LockedPrivateKey, UserAccount, AccountOption,

  Cipher,

  DappDescriptor,

  Network,

  RequestError, RequestErrorSerializedLength, mapRequestErrorToString, serializeRequestError, deserializeRequestError
};

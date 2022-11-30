// Copyright 2021-2022 @choko-wallet/sdk authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IUserAccount, UserAccount } from './account';
import { AccountOption, IAccountOption } from './accountOption';
import { DappDescriptor, IDappDescriptor } from './dapp';
import { deserializeRequestError, mapRequestErrorToString, RequestError, RequestErrorSerializedLength, serializeRequestError } from './error';
import { INetwork, KnownNetworks, Network } from './network';
import { IPayload, IRequest, IRequestHandlerDescriptor, IResponse } from './requestHandler';

export type {
  IUserAccount, IAccountOption,
  IDappDescriptor,
  INetwork, KnownNetworks,
  IPayload, IRequestHandlerDescriptor, IRequest, IResponse
};

export {
  UserAccount, AccountOption,

  DappDescriptor,

  Network,

  RequestError, RequestErrorSerializedLength, mapRequestErrorToString, serializeRequestError, deserializeRequestError
};

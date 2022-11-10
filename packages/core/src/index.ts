// Copyright 2021-2022 @choko-wallet/sdk authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AccountOption, IAccountOption, IUserAccount, IUserAccountInfo, UserAccount } from './account';
import { DappDescriptor, IDappDescriptor } from './dapp';
import { deserializeRequestError, mapRequestErrorToString, RequestError, RequestErrorSerializedLength, serializeRequestError } from './error';
import { INetwork, KnownNetworks, Network } from './network';
import { IPayload, IRequest, IRequestHandlerDescriptor, IResponse } from './requestHandler';

export type {
  IUserAccountInfo, IUserAccount, IAccountOption,
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

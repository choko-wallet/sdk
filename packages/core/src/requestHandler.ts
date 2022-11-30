// Copyright 2021-2022 @choko-wallet/core authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { HexString, Version } from './types';
import { IDappDescriptor, RequestError, UserAccount } from '.';

/**
 * Request Handlers are the extension to the wallet core
 *
 * @Request payload as ingress information
 * @Response payload as egress to the account handler
 * @RequestHandlerDescriptor is the descriptor of the request handler
 *  request handler logic is required to be wrapped within requestHandler<REQ, RES>
 */

export interface IRequestHandlerDescriptor {
  description: string;
  name: string;

  userApprovalRequired: boolean; // do we send the request to wallet approval?

  version: Version;

  // requestHandler<REQ, RES>(request: REQ, account: UserAccount): Promise<RES>
}

export interface IRequest {
  dappOrigin: IDappDescriptor;
  userOrigin?: UserAccount;

  type: HexString;

  isRemote: boolean; // do we need to interact with blockchain?
  payload?: IPayload;

  version: Version;

  validatePayload: () => boolean;
  serialize: () => Uint8Array;
// static  deserialize: (data: Uint8Array) => IRequest;
}

export interface IResponse {
  dappOrigin: IDappDescriptor;
  userOrigin?: UserAccount;

  type: HexString;

  isSuccessful: boolean;

  error?: RequestError;
  payload?: IPayload;

  version: Version;

  validatePayload: () => boolean;
  serialize: () => Uint8Array;
// static  deserialize: (data: Uint8Array) => IResponse;
}

export interface IPayload {
  build: () => Uint8Array;
  // static parse: (data: Uint8Array) => IPayload;
}

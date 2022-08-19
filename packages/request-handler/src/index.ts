// Copyright 2021-2022 @choko-wallet/request-handler authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { RequestHandlers } from '@choko-wallet/core';

import { ConnectDappDescriptor, connectDappHash, ConnectDappRequest, ConnectDappRequestPayload, ConnectDappResponse, ConnectDappResponsePayload } from './connectDapp';
import { SignMessageDescriptor, signMessageHash, SignMessageRequest, SignMessageRequestPayload, SignMessageResponse, SignMessageResponsePayload } from './signMessage';
import { SignTxDescriptor, signTxHash, SignTxRequest, SignTxRequestPayload, SignTxResponse, SignTxResponsePayload } from './signTx';

export const requestHandlers: RequestHandlers = {
  [connectDappHash]: new ConnectDappDescriptor(),
  [signMessageHash]: new SignMessageDescriptor(),
  [signTxHash]: new SignTxDescriptor()
};

export {
  ConnectDappDescriptor, connectDappHash, ConnectDappRequest, ConnectDappRequestPayload, ConnectDappResponse, ConnectDappResponsePayload,
  SignMessageDescriptor, signMessageHash, SignMessageRequest, SignMessageRequestPayload, SignMessageResponse, SignMessageResponsePayload,
  SignTxDescriptor, signTxHash, SignTxRequest, SignTxRequestPayload, SignTxResponse, SignTxResponsePayload
};

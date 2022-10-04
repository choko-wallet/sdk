// Copyright 2021-2022 @choko-wallet/sdk authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { u8aToHex } from '@skyekiwi/util';

import { compressParameters } from '@choko-wallet/core/util';
import { ConnectDappRequest, ConnectDappRequestPayload, SignMessageRequest, SignMessageRequestPayload, SignTxRequest, SignTxRequestPayload } from '@choko-wallet/request-handler';

import { getCallBackUrl, getDappDescriptor, getUserAccount } from '.';

export const WALLET_REQEUST_BASE_URL = 'https://choko.app/request';
export const LOCAL_WALLET_REQEUST_BASE_URL = 'https://localhost:3000/request';

export const buildConnectDappRequest = (): Uint8Array => {
  const dapp = getDappDescriptor();
  const userAccount = getUserAccount();

  const request = new ConnectDappRequest({
    dappOrigin: dapp,
    payload: new ConnectDappRequestPayload({}),
    userOrigin: userAccount
  });

  return compressParameters(request.serialize());
};

export const buildSignMessageRequest = (message: Uint8Array): Uint8Array => {
  const dapp = getDappDescriptor();
  const userAccount = getUserAccount();

  console.log(userAccount);
  const request = new SignMessageRequest({
    dappOrigin: dapp,
    payload: new SignMessageRequestPayload({ message }),
    userOrigin: userAccount
  });

  return compressParameters(request.serialize());
};

export const buildSignTxRequest = (encoded: Uint8Array): Uint8Array => {
  const dapp = getDappDescriptor();
  const userAccount = getUserAccount();

  const request = new SignTxRequest({
    dappOrigin: dapp,
    payload: new SignTxRequestPayload({ encoded }),
    userOrigin: userAccount
  });

  return compressParameters(request.serialize());
};

export const buildConnectDappUrl = (local?: boolean): string => {
  const callbackUrlBase = getCallBackUrl();

  return `${local ? LOCAL_WALLET_REQEUST_BASE_URL : WALLET_REQEUST_BASE_URL}?` +
    'requestType=connectDapp' + '&' +
    `payload=${u8aToHex(buildConnectDappRequest())}` + '&' +
    `callbackUrl=${encodeURIComponent(callbackUrlBase)}`;
};

export const buildSignMessageUrl = (message: Uint8Array, local?: boolean): string => {
  const callbackUrlBase = getCallBackUrl();

  return `${local ? LOCAL_WALLET_REQEUST_BASE_URL : WALLET_REQEUST_BASE_URL}?` +
    'requestType=signMessage' + '&' +
    `payload=${u8aToHex(buildSignMessageRequest(message))}` + '&' +
    `callbackUrl=${encodeURIComponent(callbackUrlBase)}`;
};

export const buildSignTxUrl = (encoded: Uint8Array, local?: boolean): string => {
  const callbackUrlBase = getCallBackUrl();

  console.log(u8aToHex(buildSignTxRequest(encoded)));

  return `${local ? LOCAL_WALLET_REQEUST_BASE_URL : WALLET_REQEUST_BASE_URL}?` +
    'requestType=signTx' + '&' +
    `payload=${u8aToHex(buildSignTxRequest(encoded))}` + '&' +
    `callbackUrl=${encodeURIComponent(callbackUrlBase)}`;
};

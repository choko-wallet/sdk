// Copyright 2021-2022 @choko-wallet/sdk authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { u8aToHex } from '@skyekiwi/util';

import { KeypairType } from '@choko-wallet/core/types';
import { compressParameters } from '@choko-wallet/core/util';
import { ConnectDappRequest, ConnectDappRequestPayload, DecryptMessageRequest, DecryptMessageRequestPayload, SignMessageRequest, SignMessageRequestPayload, SignTxRequest, SignTxRequestPayload } from '@choko-wallet/request-handler';

import getWalletUrl from './walletUrl';
import { getCallBackUrl, getDappDescriptor, getUserAccount } from '.';

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

export const buildDecryptMessageRequest = (
  keyType: KeypairType,
  message: Uint8Array,
  receiptPublicKey: Uint8Array
): Uint8Array => {
  const dapp = getDappDescriptor();
  const userAccount = getUserAccount();

  const request = new DecryptMessageRequest({
    dappOrigin: dapp,
    payload: new DecryptMessageRequestPayload({
      keyType: keyType,
      message: message,
      receiptPublicKey: receiptPublicKey
    }),
    userOrigin: userAccount
  });

  return compressParameters(request.serialize());
};

export const buildConnectDappUrl = (type?: string): string => {
  const callbackUrlBase = getCallBackUrl();
  const url = `${getWalletUrl(type)}/request`;

  return `${url}` +
    'requestType=connectDapp' + '&' +
    `payload=${u8aToHex(buildConnectDappRequest())}` + '&' +
    `callbackUrl=${encodeURIComponent(callbackUrlBase)}`;
};

export const buildSignMessageUrl = (message: Uint8Array, type?: string): string => {
  const callbackUrlBase = getCallBackUrl();
  const url = `${getWalletUrl(type)}/request`;

  return `${url}` +
    'requestType=signMessage' + '&' +
    `payload=${u8aToHex(buildSignMessageRequest(message))}` + '&' +
    `callbackUrl=${encodeURIComponent(callbackUrlBase)}`;
};

export const buildSignTxUrl = (encoded: Uint8Array, type?: string): string => {
  const callbackUrlBase = getCallBackUrl();
  const url = `${getWalletUrl(type)}/request`;

  return `${url}` +
    'requestType=signTx' + '&' +
    `payload=${u8aToHex(buildSignTxRequest(encoded))}` + '&' +
    `callbackUrl=${encodeURIComponent(callbackUrlBase)}`;
};

export const buildDecryptMessageUrl = (
  keyType: KeypairType,
  message: Uint8Array,
  receiptPublicKey: Uint8Array,
  type?: string
): string => {
  const callbackUrlBase = getCallBackUrl();
  const url = `${getWalletUrl(type)}/request`;

  return `${url}` +
    'requestType=decryptMessage' + '&' +
    `payload=${u8aToHex(buildDecryptMessageRequest(keyType, message, receiptPublicKey))}` + '&' +
    `callbackUrl=${encodeURIComponent(callbackUrlBase)}`;
};

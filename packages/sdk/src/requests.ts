// Copyright 2021-2022 @choko-wallet/sdk authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { InMemoryStorage } from './type';

import { u8aToHex } from '@skyekiwi/util';

import { KeypairType, SignMessageType, SignTxType } from '@choko-wallet/core/types';
import { compressParameters } from '@choko-wallet/core/util';
import { ConnectDappRequest, ConnectDappRequestPayload, DecryptMessageRequest, DecryptMessageRequestPayload, SignMessageRequest, SignMessageRequestPayload, SignTxRequest, SignTxRequestPayload } from '@choko-wallet/request-handler';

import getWalletUrl from './walletUrl';
import { getDappDescriptor, getUserAccount } from '.';

export const buildConnectDappRequest = (store: InMemoryStorage): Uint8Array => {
  const dapp = getDappDescriptor(store);

  const request = new ConnectDappRequest({
    dappOrigin: dapp,
    payload: new ConnectDappRequestPayload({})
  });

  return compressParameters(request.serialize());
};

export const buildSignMessageRequest = (store: InMemoryStorage, message: Uint8Array, signMessageType: SignMessageType): Uint8Array => {
  const dapp = getDappDescriptor(store);
  const userAccount = getUserAccount(store);

  const request = new SignMessageRequest({
    dappOrigin: dapp,
    payload: new SignMessageRequestPayload({ message, signMessageType }),
    userOrigin: userAccount
  });

  return compressParameters(request.serialize());
};

export const buildSignTxRequest = (store: InMemoryStorage, encoded: Uint8Array, signTxType: SignTxType): Uint8Array => {
  const dapp = getDappDescriptor(store);
  const userAccount = getUserAccount(store);

  const request = new SignTxRequest({
    dappOrigin: dapp,
    payload: new SignTxRequestPayload({ encoded, signTxType }),
    userOrigin: userAccount
  });

  return compressParameters(request.serialize());
};

export const buildDecryptMessageRequest = (
  store: InMemoryStorage,
  keyType: KeypairType,
  message: Uint8Array,
  receiptPublicKey: Uint8Array
): Uint8Array => {
  const dapp = getDappDescriptor(store);
  const userAccount = getUserAccount(store);

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

export const buildConnectDappUrl = (
  store: InMemoryStorage,
  callbackUrl: string,
  type?: string
): string => {
  const url = `${getWalletUrl(type)}/request?`;

  return `${url}` +
    'requestType=connectDapp' + '&' +
    `payload=${u8aToHex(buildConnectDappRequest(store))}` + '&' +
    `callbackUrl=${encodeURIComponent(callbackUrl)}`;
};

export const buildSignMessageUrl = (
  store: InMemoryStorage,

  message: Uint8Array,
  signMessageType: SignMessageType,
  callbackUrl: string,
  type?: string
): string => {
  const url = `${getWalletUrl(type)}/request?`;

  return `${url}` +
    'requestType=signMessage' + '&' +
    `payload=${u8aToHex(buildSignMessageRequest(store, message, signMessageType))}` + '&' +
    `callbackUrl=${encodeURIComponent(callbackUrl)}`;
};

export const buildSignTxUrl = (
  store: InMemoryStorage,

  encoded: Uint8Array,
  signTxType: SignTxType,
  callbackUrl: string,
  type?: string
): string => {
  const url = `${getWalletUrl(type)}/request?`;

  return `${url}` +
    'requestType=signTx' + '&' +
    `payload=${u8aToHex(buildSignTxRequest(store, encoded, signTxType))}` + '&' +
    `callbackUrl=${encodeURIComponent(callbackUrl)}`;
};

export const buildDecryptMessageUrl = (
  store: InMemoryStorage,

  keyType: KeypairType,
  message: Uint8Array,
  receiptPublicKey: Uint8Array,
  callbackUrl: string,
  type?: string
): string => {
  const url = `${getWalletUrl(type)}/request?`;

  return `${url}` +
    'requestType=decryptMessage' + '&' +
    `payload=${u8aToHex(buildDecryptMessageRequest(store, keyType, message, receiptPublicKey))}` + '&' +
    `callbackUrl=${encodeURIComponent(callbackUrl)}`;
};

// Copyright 2021-2022 @choko-wallet/mpc authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { secureGenerateRandomKey } from '@skyekiwi/crypto';

import { defaultAccountOption, UserAccount } from '@choko-wallet/core';

import { clientNode, clientNodeRawAddr } from './fixtures';
import { extractPublicKey, MpcRequest, SerializedLocalKey, SerializedSignature } from './interface';

const runKeygenRequest = async (
  wasmRunKeygen: (payload: string, clientId: string, clientAddr: string, enableLog: boolean) => Promise<SerializedLocalKey>,
  enableLog: boolean,
  existingKey?: Uint8Array
): Promise<SerializedLocalKey> => {
  const payloadId = secureGenerateRandomKey();
  const keygenRequst = MpcRequest.newKeyGenRequest(payloadId, existingKey);

  return await wasmRunKeygen(
    keygenRequst.serialize(),
    clientNode[0], // peerId
    clientNodeRawAddr,
    enableLog
  );
};

const runSignRequest = async (
  wasmRunSign: (payload: string, localKey: string, clientId: string, clientAddr: string, enableLog: boolean) => Promise<SerializedSignature>,
  message: Uint8Array,
  keygenId: Uint8Array,
  localKey: SerializedLocalKey,
  enableLog: boolean
): Promise<SerializedSignature> => {
  const payloadId = secureGenerateRandomKey();
  const signRequet = MpcRequest.newSignRequest(payloadId, message, keygenId);

  return await wasmRunSign(
    signRequet.serialize(),
    localKey,
    clientNode[0],
    clientNodeRawAddr,
    enableLog
  );
};

const mpcLocalKeyToAccount = (
  localKey: SerializedLocalKey
): UserAccount => {
  const publicKey = extractPublicKey(localKey);
  const userAccount = new UserAccount(defaultAccountOption);

  userAccount.publicKeys = [
    new Uint8Array(33),
    new Uint8Array(33),
    publicKey
  ];

  return userAccount;
};

export { runKeygenRequest, runSignRequest, mpcLocalKeyToAccount };

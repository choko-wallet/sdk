// Copyright 2021-2022 @choko-wallet/app-utils authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { UserAccount } from '@choko-wallet/core';
import { defaultMpcAccountOption } from '@choko-wallet/core/accountOption';
import superagent from 'superagent';

import { stringToU8a, u8aToString } from '@skyekiwi/util';

import { fetchPeers } from './fixtures';
import { extractPublicKey, MpcRequest, SerializedLocalKey, SerializedSignature } from './interface';

const MPC_SERVICE_URL = 'http://0.0.0.0:2619';

const runKeygenRequest = async (
  payloadId: Uint8Array,
  serializedAuthHeader: string
): Promise<SerializedLocalKey> => {
  const fixture = await fetchPeers();
  const keygenRequst = MpcRequest.newKeyGenRequest(fixture, payloadId);

  const r = await superagent
    .post(`${MPC_SERVICE_URL}/mpc/submit`)
    .send({
      auth_header: serializedAuthHeader,
      job_header: keygenRequst.serialize(),
      maybe_local_key: 'null'
    });

  try {
    /* eslint-disable */
    const re = JSON.parse(r.text).KeyGen;

    return u8aToString(new Uint8Array(re.local_key));
    /* eslint-enable */
  } catch (e) {
    throw new Error(r.text);
  }
};

const runSignRequest = async (
  payloadId: Uint8Array,
  serializedAuthHeader: string,
  localKey: string,
  message: Uint8Array
): Promise<SerializedSignature> => {
  const fixture = await fetchPeers();
  const signRequet = MpcRequest.newSignRequest(fixture, payloadId, message);

  const r = await superagent
    .post(`${MPC_SERVICE_URL}/mpc/submit`)
    .send(JSON.stringify({
      auth_header: serializedAuthHeader,
      job_header: signRequet.serialize(),
      maybe_local_key: `${JSON.stringify(Array.from(stringToU8a(localKey)))}`
    }));

  try {
    /* eslint-disable */
    const re = JSON.parse(r.text).Sign;

    return u8aToString(new Uint8Array(re.sig));
    /* eslint-enable */
  } catch (e) {
    throw new Error(r.text);
  }
};

const runKeyRefreshRequest = async (
  payloadId: Uint8Array,
  serializedAuthHeader: string
): Promise<SerializedLocalKey> => {
  const fixture = await fetchPeers();
  const keyrefreshRequest = MpcRequest.newKeyRefreshRequest(fixture, payloadId);

  const r = await superagent
    .post(`${MPC_SERVICE_URL}/mpc/submit`)
    .send({
      auth_header: serializedAuthHeader,
      job_header: keyrefreshRequest.serialize(),
      maybe_local_key: 'null'
    });

  try {
    /* eslint-disable */
    const re = JSON.parse(r.text).KeyRefresh;

    return u8aToString(new Uint8Array(re.new_key));
    /* eslint-enable */
  } catch (e) {
    throw new Error(r.text);
  }
};

const mpcLocalKeyToAccount = (localKey: SerializedLocalKey): UserAccount => {
  const publicKey = extractPublicKey(localKey);
  const userAccount = new UserAccount(defaultMpcAccountOption);

  userAccount.publicKeys = [
    publicKey,
    new Uint8Array(32)
  ];

  userAccount.noteMpcWallet(localKey);

  return userAccount;
};

export { runKeygenRequest, runSignRequest, runKeyRefreshRequest, mpcLocalKeyToAccount };

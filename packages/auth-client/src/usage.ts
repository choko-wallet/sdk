// Copyright 2021-2022 @choko-wallet/auth-client authors & contributors
// SPDX-License-Identifier: Apache-2.0

import superagent from 'superagent';

import { u8aToHex } from '@skyekiwi/util';

import { AUTH_SERVER_URL } from './config';
import { Certificate } from './types';

export async function linkUsage (
  keygenId: Uint8Array,
  ownershipProof: Certificate
): Promise<Certificate> {
  if (keygenId.length !== 32) { // eslint-disable-line
    throw new Error('invalid keygen_id length');
  }

  const res =
    await superagent.post(`${AUTH_SERVER_URL}/usage/link`)
      .send({
        keygen_id: u8aToHex(keygenId),               // eslint-disable-line
        ownership_proof: ownershipProof.serialize()  // eslint-disable-line
      }).accept('json');

  return Certificate.fromString(res.text);
}

export async function validateUsage (
  keygenId: Uint8Array,
  credentialHash: Uint8Array,
  usageCertification: Certificate
): Promise<string> {
  const res =
    await superagent.post(`${AUTH_SERVER_URL}/usage/validate`)
      .send({
        keygen_id: u8aToHex(keygenId),                       // eslint-disable-line
        credential_hash: u8aToHex(credentialHash),           // eslint-disable-line
        usage_certification: usageCertification.serialize()  // eslint-disable-line
      }).accept('json');

  return res.text;
}

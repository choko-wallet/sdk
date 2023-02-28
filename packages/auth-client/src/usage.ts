// [object Object]
// SPDX-License-Identifier: Apache-2.0

import { u8aToHex } from '@skyekiwi/util';
import superagent from 'superagent';

import { AUTH_SERVER_URL } from './config';
import { Certificate } from './types';

export async function linkUsage (keygen_id: Uint8Array, ownership_proof: Certificate) {
  if (keygen_id.length !== 32) {
    throw new Error('invalid keygen_id length');
  }

  const certification =
        await superagent.post(`${AUTH_SERVER_URL}/usage/link`)
          .send({
            keygen_id: u8aToHex(keygen_id),
            ownership_proof: ownership_proof.serialize()
          }).accept('json');

  return certification;
}

export async function validateUsage (keygen_id: Uint8Array, credential_hash: Uint8Array, usage_certification: Certificate) {
  const certificate =
        await superagent.post(`${AUTH_SERVER_URL}/usage/validate`)
          .send({
            keygen_id: u8aToHex(keygen_id),
            credential_hash: u8aToHex(credential_hash),
            usage_certification: usage_certification.serialize()
          }).accept('json');

  return certificate;
}

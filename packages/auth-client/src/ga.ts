// [object Object]
// SPDX-License-Identifier: Apache-2.0

import { blake2s } from '@noble/hashes/blake2s';
import { u8aToHex } from '@skyekiwi/util';
import superagent from 'superagent';

import { AUTH_SERVER_URL } from './config';
import { GAAuthValidateRequest } from './types';

export async function initProofOfOwnership () {
  const gaToken = await superagent.post(`${AUTH_SERVER_URL}/auth/ga/init`);

  return gaToken;
}

export async function validateProofOfOwnership (gaToken: string, code: Uint8Array) {
  const gaHash = u8aToHex(blake2s(gaToken));
  const codeHex = u8aToHex(code);

  const certificate = await superagent
    .post(`${AUTH_SERVER_URL}/auth/ga/validate`)
    .send({
      ga_hash: gaHash,
      code: codeHex,
      time: 0
    } as GAAuthValidateRequest)
    .accept('json');

  return certificate;
}

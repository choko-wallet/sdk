// [object Object]
// SPDX-License-Identifier: Apache-2.0

import { blake2s } from '@noble/hashes/blake2s';
import { u8aToHex } from '@skyekiwi/util';
import superagent from 'superagent';

import { AUTH_SERVER_URL } from './config';
import { Certificate, EmailAuthInitRequest, EmailAuthValidate, ICertificate } from './types';

export async function initProofOfOwnership (email: string) {
  const res = await superagent
    .post(`${AUTH_SERVER_URL}/auth/email/init`)
    .send({
      email: email
    } as EmailAuthInitRequest);

  return res.text;
}

export async function validateProofOfOwnership (email: string, code: Uint8Array) {
  if (code.length !== 6) {
    throw new Error('invalid code length');
  }

  const emailHash = u8aToHex(blake2s(email));
  const codeHex = u8aToHex(code);

  const certificateString = await superagent
    .post(`${AUTH_SERVER_URL}/auth/email/validate`)
    .send({
      email_hash: emailHash,
      code: codeHex
    } as EmailAuthValidate)
    .accept('json');

  const certificate = JSON.parse(certificateString.text);

  return new Certificate(certificate as ICertificate);
}

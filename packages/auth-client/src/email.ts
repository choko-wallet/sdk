// Copyright 2021-2022 @choko-wallet/auth-client authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { blake2s } from '@noble/hashes/blake2s';
import { u8aToHex } from '@skyekiwi/util';
import superagent from 'superagent';

import { AUTH_SERVER_URL } from './config';
import { Certificate, EmailAuthInitRequest, EmailAuthValidate, ICertificate } from './types';

export async function initProofOfOwnership (email: string): Promise<string> {
  const res = await superagent
    .post(`${AUTH_SERVER_URL}/auth/email/init`)
    .send({
      email: email
    } as EmailAuthInitRequest);

  return res.text;
}

export async function validateProofOfOwnership (email: string, code: Uint8Array): Promise<Certificate> {
  if (code.length !== 6) {
    throw new Error('invalid code length');
  }

  const emailHash = u8aToHex(blake2s(email));
  const codeHex = u8aToHex(code);

  const certificateString = await superagent
    .post(`${AUTH_SERVER_URL}/auth/email/validate`)
    .send({
      code: codeHex,
      email_hash: emailHash
    } as EmailAuthValidate)
    .accept('json');

  const certificate = JSON.parse(certificateString.text) as ICertificate;

  return new Certificate(certificate);
}

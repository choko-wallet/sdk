// Copyright 2021-2022 @choko-wallet/auth-client authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { blake2s } from '@noble/hashes/blake2s';
import { u8aToHex } from '@skyekiwi/util';
import superagent from 'superagent';

import { AUTH_SERVER_URL } from './config';
import { Certificate, GAAuthValidateRequest, ICertificate } from './types';

export async function initGAProofOfOwnership (): Promise<string> {
  const res = await superagent.post(`${AUTH_SERVER_URL}/auth/ga/init`);

  return res.text;
}

export async function validateGAProofOfOwnership (gaToken: string, code: Uint8Array): Promise<Certificate> {
  const gaHash = u8aToHex(blake2s(gaToken));
  const codeHex = u8aToHex(code);

  const certificateString = await superagent
    .post(`${AUTH_SERVER_URL}/auth/ga/validate`)
    .send({
      code: codeHex,
      ga_hash: gaHash,
      time: 0
    } as GAAuthValidateRequest)
    .accept('json');

  const certificate = JSON.parse(certificateString.text) as ICertificate;

  return new Certificate(certificate);
}

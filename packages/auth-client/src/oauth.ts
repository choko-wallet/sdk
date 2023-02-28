// Copyright 2021-2022 @choko-wallet/auth-client authors & contributors
// SPDX-License-Identifier: Apache-2.0

import superagent from 'superagent';

import { AUTH_SERVER_URL } from './config';
import { Certificate, ICertificate, OAuthAuthValidate } from './types';

export async function validateProofOfOwnership (provider: string, email: string, token: string): Promise<Certificate> {
  const certificateString = await superagent
    .post(`${AUTH_SERVER_URL}/auth/oauth/validate`)
    .send({ email, provider, token } as OAuthAuthValidate)
    .accept('json');

  const certificate = JSON.parse(certificateString.text) as ICertificate;

  return new Certificate(certificate);
}

// [object Object]
// SPDX-License-Identifier: Apache-2.0

import superagent from 'superagent';

import { AUTH_SERVER_URL } from './config';
import { OAuthAuthValidate } from './types';

export async function validateProofOfOwnership (provider: string, email: string, token: string) {
  const certificate = await superagent
    .post(`${AUTH_SERVER_URL}/auth/oauth/validate`)
    .send({ provider, email, token } as OAuthAuthValidate)
    .accept('json');

  return certificate;
}

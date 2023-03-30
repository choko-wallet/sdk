// Copyright 2021-2022 @choko-wallet/auth-client authors & contributors
// SPDX-License-Identifier: Apache-2.0

import superagent from 'superagent';

import { AUTH_SERVER_URL } from './config';
import { Certificate, OAuthAuthPreimage, OAuthAuthValidate } from './types';

export async function validateOAuthProofOfOwnership (provider: string, email: string, token: string, url = AUTH_SERVER_URL): Promise<Certificate> {
  const certificateString = await superagent
    .post(`${url}/auth/oauth/validate`)
    .send({ email, provider, token } as OAuthAuthValidate)
    .accept('json');

  return Certificate.fromString(certificateString.text);
}

export async function confirmOAuthProofOfOwnership (provider: string, email: string, token: string, url = AUTH_SERVER_URL): Promise<boolean> {
  const result = await superagent
    .post(`${url}/auth/oauth/confirm`)
    .send({ email, provider, token } as OAuthAuthValidate)
    .accept('json');

  return !result.error;
}

export async function preimageOAuthProofOfOwnership (provider: string, email: string, url = AUTH_SERVER_URL): Promise<boolean> {
  const result = await superagent
    .post(`${url}/auth/oauth/preimage`)
    .send({ email, provider } as OAuthAuthPreimage)
    .accept('json');

  if (result.text === 'preimage_in_db') {
    return true;
  } else {
    return false;
  }
}

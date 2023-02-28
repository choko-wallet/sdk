// Copyright 2021-2022 @choko-wallet/auth-client authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { u8aToHex } from '@skyekiwi/util';

export interface EmailAuthInitRequest {
  email: string
}

export interface EmailAuthValidate {
  email_hash: string,
  code: string,
}

export interface GAAuthValidateRequest {
  ga_hash: string,
  code: string,
  time: number
}

export interface OAuthAuthValidate {
  provider: string,
  email: string,
  token: string
}

export interface UsageLinkRequest {
  keygen_id: string,
  ownership_proof: string
}

export interface UsageValidateRequest {
  keygen_id: string,
  credential_hash: string,
  usage_certification: string
}

export interface ICertificate {
  payload: Uint8Array,
  signature: Uint8Array,
}

export class Certificate implements ICertificate {
  payload: Uint8Array
  signature: Uint8Array

  constructor (c: ICertificate) {
    this.payload = c.payload;
    this.signature = c.signature;
  }

  public serialize (): string {
    return JSON.stringify({
      payload: u8aToHex(this.payload),
      signature: u8aToHex(this.signature)
    });
  }

  public validate(): boolean {
    return true;
  }
}

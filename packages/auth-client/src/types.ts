// Copyright 2021-2022 @choko-wallet/auth-client authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { hexToU8a, u8aToHex } from '@skyekiwi/util';

export interface EmailAuthInitRequest {
  email: string
}

export interface EmailAuthValidate {
  email_hash: string, // eslint-disable-line
  code: string,
}

export interface GAAuthValidateRequest {
  ga_hash: string, // eslint-disable-line
  code: string,
  time: number
}

export interface OAuthAuthValidate {
  email: string,
  provider: string,
  token: string
}

export interface UsageLinkRequest {
  keygen_id: string,      // eslint-disable-line
  ownership_proof: string // eslint-disable-line
}

export interface UsageValidateRequest {
  keygen_id: string,          // eslint-disable-line
  credential_hash: string,    // eslint-disable-line
  usage_certification: string // eslint-disable-line
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

  public static fromString (s: string): Certificate {
    const rawCertificate = JSON.parse(s) as {
      payload: string, signature: string
    };
    const certificate = {
      payload: hexToU8a(rawCertificate.payload),
      signature: hexToU8a(rawCertificate.signature)
    } as ICertificate;

    return new Certificate(certificate);
  }

  public serialize (): string {
    return JSON.stringify({
      payload: u8aToHex(this.payload),
      signature: u8aToHex(this.signature)
    });
  }

  public validate (): boolean {
    return true;
  }
}

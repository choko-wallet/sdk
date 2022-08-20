// Copyright 2021-2022 @choko-wallet/core authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { xxhashAsU8a } from '@polkadot/util-crypto';
import pako from 'pako';

import { KeypairType } from './types';

export const keypairTypeNumberToString = (keyType: number): KeypairType => {
  switch (keyType) {
    case 0:
      return 'sr25519';
    case 1:
      return 'ed25519';
    case 2:
      return 'ecdsa';
    case 3:
      return 'ethereum';
    default:
      throw new Error('unknown key type - Util.mapKeyTypeToString');
  }
};

export const keypairTypeStringToNumber = (keyType: KeypairType): number => {
  switch (keyType) {
    case 'sr25519':
      return 0;
    case 'ed25519':
      return 1;
    case 'ecdsa':
      return 2;
    case 'ethereum':
      return 3;
    default:
      throw new Error('unknown key type - Util.mapKeypairTypeToNumber');
  }
};

export const keypairTypeToCurveType = (keyType: KeypairType): string => {
  switch (keyType) {
    case 'sr25519':
      return 'sr25519';
    case 'ed25519':
      return 'x25519';
    case 'ecdsa':
      return 'secp256k1';
    case 'ethereum':
      return 'secp256k1';
    default:
      throw new Error('unknown key type - Util.mapKeypairTypeToEncryptionCurve');
  }
};

export const xxHash = (data: string | Uint8Array): Uint8Array => {
  return xxhashAsU8a(data);
};

export const compressParameters = (params: Uint8Array): Uint8Array => {
  const originalLength = params.length;
  const compressed = pako.deflate(params);

  if (compressed.length > originalLength) {
    // no compression
    const res = new Uint8Array(originalLength + 1);

    res[0] = 0;
    res.set(params, 1);

    return res;
  } else {
    const res = new Uint8Array(compressed.length + 1);

    res[0] = 1;
    res.set(compressed, 1);

    return res;
  }
};

export const decompressParameters = (params: Uint8Array): Uint8Array => {
  if (params[0] === 0) {
    return params.slice(1);
  } else {
    return pako.inflate(params.slice(1));
  }
};

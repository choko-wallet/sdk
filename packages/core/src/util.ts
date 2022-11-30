// Copyright 2021-2022 @choko-wallet/core authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { xxhashAsU8a } from '@polkadot/util-crypto';
import pako from 'pako';

import { KeypairType, SignMessageType } from './types';

/**
  * convert KeypairType from number -> KeypairType (string)
  * @param {number} keyType the number from 0 - 3 of the KeypairType
  * @returns {KeypairType} the string format of KeypairType
*/
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

/**
  * convert KeypairType from KeypairType(string) -> number
  * @param {KeypairType} keyType the string format of KeypairType
  * @returns {number} keyType the number from 0 - 3 of the KeypairType
*/
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

/**
  * convert SignMessageType from number -> SignMessageType (string)
  * @param {SignMessageType} signMesasgeTypeId the number from 0 - 3 of the SignMessageType
  * @returns {number} signMesasgeTypeId
*/
export const signMessageTypeToId = (signMessageType: SignMessageType): number => {
  switch (signMessageType) {
    case 'raw-sr25519': return 0;
    case 'raw-ed25519': return 1;
    case 'ethereum-personal': return 2;
    default:
      throw new Error('unknown signature type - Util.signMessageTypeToId');
  }
};

/**
  * convert SignMessageType from KeypairType(string) -> number
  * @param {number} signMesasgeTypeId id of the SignMessageType
  * @returns {SignMessageType} SignMessageType
*/
export const signMessageTypeToString = (signMesasgeTypeId: number): SignMessageType => {
  switch (signMesasgeTypeId) {
    case 0: return 'raw-sr25519';
    case 1: return 'raw-ed25519';
    case 2: return 'ethereum-personal';
    default:
      throw new Error('unknown signature type - Util.signMessageTypeToString');
  }
};

export const xxHash = (data: string | Uint8Array): Uint8Array => {
  return xxhashAsU8a(data);
};

/**
  * comporess paramters sent via URL
  * We tried to comporess the paramters by pako(zlib).
  * Sometimes, the params is random and compression actually increase the size of the product.
  * Therefore, we attach a flag at the beginning of the params
  * 0 = not compressed 1 = compressed with zlib
  * @param {Uint8Array} params the original request parameters
  * @returns {Uint8Array} the compressed request parameters
*/
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

/**
  * decompress paramters sent via URL
  * Test the flag at the first byte
  * 0 = not compressed, return AS IS
  * 1 = decompress with zlib
  * @param {Uint8Array} params the original request parameters
  * @returns {Uint8Array} the compressed request parameters
*/
export const decompressParameters = (params: Uint8Array): Uint8Array => {
  if (params[0] === 0) {
    return params.slice(1);
  } else {
    return pako.inflate(params.slice(1));
  }
};

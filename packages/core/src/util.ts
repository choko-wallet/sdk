// Copyright 2021-2022 @choko-wallet/core authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { xxhashAsU8a } from '@polkadot/util-crypto';
import pako from 'pako';

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

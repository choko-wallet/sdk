// Copyright 2021-2022 @choko-wallet/sdk authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { hexToU8a } from '@skyekiwi/util';

import { compressParameters, decompressParameters } from './util';

describe('@choko-wallet/core', function () {
  it('compress decompress', () => {
    const params = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const compressed = compressParameters(params);
    const decompressed = decompressParameters(compressed);

    console.log(compressed.length, params.length);
    expect(decompressed).toEqual(params);
  });

  it('compress decompress real payload sample', () => {
    const params = hexToU8a('00000004746573740000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c4a6573742054657374696e670000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000');
    const compressed = compressParameters(params);
    const decompressed = decompressParameters(compressed);

    console.log(compressed.length, params.length);
    expect(decompressed).toEqual(params);
  });
});

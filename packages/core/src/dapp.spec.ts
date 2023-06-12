// Copyright 2021-2022 @choko-wallet/core authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { u8aToHex } from '@skyekiwi/util';

import { DappDescriptor } from './dapp';

describe('DappDescriptor - @choko-wallet/core/dapp', function () {
  it('DappDescriptor - serde', () => {
    const dapp = new DappDescriptor({
      displayName: 'Jest Testing',
      infoName: 'test',
      version: 0
    });

    const data = dapp.serialize();

    expect(u8aToHex(data)).toEqual('00000004746573740000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c4a6573742054657374696e670000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000');

    const dapp2 = DappDescriptor.deserialize(data);

    expect(dapp2.displayName).toEqual(dapp.displayName);
    expect(dapp2.infoName).toEqual(dapp.infoName);
    expect(dapp2.version).toEqual(dapp.version);
  });
});

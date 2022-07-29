// Copyright 2021-2022 @choko-wallet/sdk authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { u8aToHex } from '@skyekiwi/util';

import { xxHash } from '@choko-wallet/core/util';

describe('@choko-wallet/known-networks', function () {
  it('gethash', () => {
    const hash = xxHash('skyekiwi');

    console.log(u8aToHex(hash));
  });
});

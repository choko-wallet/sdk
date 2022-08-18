// Copyright 2021-2022 @choko-wallet/sdk authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { xxHash } from './util';

describe('@choko-wallet/sdk', function () {
  it('dummy', () => {
    const x = xxHash('hello');

    console.log(x);
    expect(x.length).toBe(8);
  });
});

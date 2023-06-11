// Copyright 2021-2022 @choko-wallet/token-price authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { fetchMarketCap } from '.';

describe('@choko-wallet/token-price', function () {
  it('correctly fetch the CA address', async () => {
    await fetchMarketCap();
  });
});

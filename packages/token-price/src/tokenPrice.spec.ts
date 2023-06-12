// Copyright 2021-2022 @choko-wallet/account authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { getPublicClient } from '@choko-wallet/rpc';

import { fetchBalanceInfoByAddress, getTotalBalanceInUSD } from '.';

// eslint-disable-next-line
globalThis.fetch = require('isomorphic-fetch');

describe('@choko-wallet/account', function () {
  it('try fetch data token balance and price', async () => {
    const start = Date.now();

    const res = await fetchBalanceInfoByAddress(
      /* eslint-disable */
      // @ts-ignore
      getPublicClient(1),
      /* eslint-enable */
      '0x21a31Ee1afC51d94C2eFcCAa2092aD1028285549',
      1
    );

    const b = getTotalBalanceInUSD(res);

    console.log(`Time elapsed: ${Date.now() - start} ms`);
    console.log('Total: ', b);
    console.log(res);
  });
});

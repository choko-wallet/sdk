// Copyright 2021-2022 @choko-wallet/abi authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { getPublicClient } from '.';

globalThis.fetch = require('isomorphic-fetch');

describe('@choko-wallet/rpc', function () {
  [1, 5, 137, 80001, 56].map((chainId) => {
    it(`dummy get chainId for chainId ${chainId}`, async () => {
      const client = getPublicClient(chainId);
      const remoteChainId = await client.getChainId();

      console.log(await client.getBlockNumber());
      expect(chainId).toBe(remoteChainId);
    });
  });
});

// Copyright 2021-2022 @choko-wallet/mpc authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { initProofOfOwnership } from './ga';

// GA Auth Flow
describe('auth-client/ga-init', () => {
  it('GA proof of ownership is working.', async () => {
    const gaToken = await initProofOfOwnership();

    console.log(gaToken)
  });
});
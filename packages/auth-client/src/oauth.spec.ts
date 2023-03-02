// Copyright 2021-2022 @choko-wallet/mpc authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { validateProofOfOwnership } from './oauth';

// OAuth Auth Flow
describe('auth-client/oauth', () => {
  it('OAuth proof of ownership is working.', async () => {
    const res2 = await validateProofOfOwnership(/* TODO */);

    console.log(res2);
  });
});
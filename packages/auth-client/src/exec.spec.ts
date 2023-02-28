// Copyright 2021-2022 @choko-wallet/mpc authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { initProofOfOwnership, validateProofOfOwnership } from './email';

// Email Auth Flow
describe('auth-client/email', () => {
  it('email proof of ownership is working.', async () => {
    const res = await initProofOfOwnership('test@skye.kiwi');

    console.log(res);

    const res2 = await validateProofOfOwnership('test@skye.kiwi', new Uint8Array([9, 2, 0, 5, 2, 1]));

    console.log(res2);
  });
});

// describe('auth-client/email', () => {
//   it('email proof of ownership is working.', async () => {
//     initProofOfOwnership('');
//   });
// });

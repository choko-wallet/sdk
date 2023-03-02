// Copyright 2021-2022 @choko-wallet/mpc authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { validateProofOfOwnership } from './ga';

// GA Auth Flow
describe('auth-client/ga-verify', () => {
  it('GA proof of ownership is working.', async () => {
    try {
        const gaToken = "CA35UWRCOTDP6GVZS746WEAV7JFPRM5V"
        const res2 = await validateProofOfOwnership(gaToken, new Uint8Array([2,5,6,7,5,2]));

        console.log(res2);
    } catch(err) {
        console.log((err as any).response.text)
    }
  });
});
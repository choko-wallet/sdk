// Copyright 2021-2023 @choko-wallet/ens authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Address } from 'viem';

import { ContractAccount, defaultAccountOption, EoaAccount } from '@choko-wallet/account';
import { getPublicClient } from '@choko-wallet/rpc';

import { gaslessRegisterEns, resolveEnsAddress, resolveEnsName } from '.';

// eslint-disable-next-line
globalThis.fetch = require('isomorphic-fetch');

const seed = '<SEED>';

describe('@choko-wallet/ens', function () {
  it('e2e', async () => {
    const eoaAccount = new EoaAccount(defaultAccountOption);

    eoaAccount.unlock(seed);
    eoaAccount.init();

    /* Dummy thing to keep the jest happy */
    const dummy = await getPublicClient(5).getBalance({
      address: eoaAccount.getAddress('ethereum') as Address
    });

    console.log(dummy);
    /* Dummy thing to keep the jest happy */

    const ca = new ContractAccount(eoaAccount.toViemAccount(), 5);
    const ownerAddr = await ca.getAddress();

    console.log(ownerAddr);

    const newAccount = new EoaAccount(defaultAccountOption);

    newAccount.random();

    try {
      await gaslessRegisterEns(ca, 'test', 'choko.id', newAccount.getAddress('ethereum') as Address);
    } catch (e) {
      console.log(e);
    }

    const resolvedAddr = await resolveEnsAddress(getPublicClient(5), 'test.choko.id');
    const resolveName = await resolveEnsName(getPublicClient(5), newAccount.getAddress('ethereum') as Address);

    console.log('resolveAddr', resolvedAddr);
    console.log('resolveName', resolveName);

    expect(resolveName).toBe('test.choko.id');
  });
});

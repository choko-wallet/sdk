// Copyright 2021-2022 @choko-wallet/abi authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { encodeContractCall } from '@choko-wallet/abi';

import { defaultAccountOption } from '../options';
import { EoaAccount } from '..';
import { ContractAccount } from './stackup';

globalThis.fetch = require('isomorphic-fetch');

const seed = 'ramp energy number hotel april joy decide field label student survey tide';

describe('@choko-wallet/account', function () {
  it('correctly fetch the CA address', async () => {
    const eoaAccount = new EoaAccount(defaultAccountOption);

    eoaAccount.unlock(seed);
    eoaAccount.init();

    const user = new ContractAccount(eoaAccount.toViemAccount(), 5);
    const addr = await user.getAddress();

    expect(addr).toBe('0x8145BF5e1BbdEC2447b063cE69A367F266c2a1c2');
  });

  it('correctly send direct tx with CA', async () => {
    const linkTokenContract = '0x326c977e6efc84e512bb9c30f76e30c160ed06fb';
    const decimals = 18;

    const eoaAccount = new EoaAccount(defaultAccountOption);

    eoaAccount.unlock(seed);
    eoaAccount.init();

    // const walletClient = getWalletClient(5);
    // const res = await walletClient.sendTransaction({
    //   to: linkTokenContract,
    // data: encodeContractCall('erc20', 'transfer', [
    //   '0x6B843808321e8E8Fe62cEf79aE63C828D60e496B',
    //   BigInt(10) ** BigInt(decimals) * BigInt(10)
    // ]),
    //   chain: getViemChainConfig(5),
    //   account: eoaAccount.toViemAccount(),
    // })

    // console.log(res)
    const ca = new ContractAccount(eoaAccount.toViemAccount(), 5);
    // const deploy = await ca.deployContract();
    // console.log(deploy)

    await ca.gaslessExecute([{
      to: linkTokenContract,
      data: encodeContractCall('erc20', 'transfer', [
        '0x8145BF5e1BbdEC2447b063cE69A367F266c2a1c2',
        BigInt(10) ** BigInt(decimals) * BigInt(1)
      ])
    }, {
      to: linkTokenContract,
      data: encodeContractCall('erc20', 'transfer', [
        '0x8145BF5e1BbdEC2447b063cE69A367F266c2a1c2',
        BigInt(10) ** BigInt(decimals) * BigInt(2)
      ])
    }, {
      to: linkTokenContract,
      data: encodeContractCall('erc20', 'transfer', [
        '0x8145BF5e1BbdEC2447b063cE69A367F266c2a1c2',
        BigInt(10) ** BigInt(decimals) * BigInt(3)
      ])
    }], 'https://api.stackup.sh/v1/node/bec1583bb0179c741ea9eabbdd5d4c38b8319939b8799103b5a0d6160eb576dc');

    // const res = await ca.execute([{
    //   to: linkTokenContract,
    //   value: BigInt(0),
    //   data: encodeContractCall('erc20', 'transfer', [
    //     '0x8145BF5e1BbdEC2447b063cE69A367F266c2a1c2',
    //     BigInt(10) ** BigInt(decimals) * BigInt(1)
    //   ]),
    // }]);
  });

  // it('correctly send relayed tx with CA', async () => {
  //   const linkTokenContract = '0x326c977e6efc84e512bb9c30f76e30c160ed06fb'
  //   const decimals = 18;

  //   const eoaAccount = new EoaAccount(defaultAccountOption);
  //   eoaAccount.unlock(seed);
  //   eoaAccount.init();

  //   // const walletClient = getWalletClient(5);
  //   // const res = await walletClient.sendTransaction({
  //   //   to: linkTokenContract,
  //     // data: encodeContractCall('erc20', 'transfer', [
  //     //   '0x6B843808321e8E8Fe62cEf79aE63C828D60e496B',
  //     //   BigInt(10) ** BigInt(decimals) * BigInt(10)
  //     // ]),
  //   //   chain: getViemChainConfig(5),
  //   //   account: eoaAccount.toViemAccount(),
  //   // })

  //   // console.log(res)
  //   const ca = new ContractAccount(eoaAccount.toViemAccount(), 5);
  //   // const deploy = await ca.deployContract();
  //   // console.log(deploy)

  //   const res = await ca.gaslessExecute([{
  //     to: linkTokenContract,
  //     data: encodeContractCall('erc20', 'transfer', [
  //       '0x8145BF5e1BbdEC2447b063cE69A367F266c2a1c2',
  //       BigInt(10) ** BigInt(decimals) * BigInt(1)
  //     ]),
  //   }, {
  //     to: linkTokenContract,
  //     data: encodeContractCall('erc20', 'transfer', [
  //       '0x8145BF5e1BbdEC2447b063cE69A367F266c2a1c2',
  //       BigInt(10) ** BigInt(decimals) * BigInt(2)
  //     ]),
  //   }, {
  //     to: linkTokenContract,
  //     data: encodeContractCall('erc20', 'transfer', [
  //       '0x8145BF5e1BbdEC2447b063cE69A367F266c2a1c2',
  //       BigInt(10) ** BigInt(decimals) * BigInt(3)
  //     ]),
  //   }], 'https://api.stackup.sh/v1/node/<KEY>',
  //   'https://api.stackup.sh/v1/paymaster/<KEY>' );

  //   // const res = await ca.directExec([{
  //   //   to: linkTokenContract,
  //   //   data: encodeContractCall('erc20', 'transfer', [
  //   //     '0x6B843808321e8E8Fe62cEf79aE63C828D60e496B',
  //   //     BigInt(10) ** BigInt(decimals) * BigInt(1)
  //   //   ]),
  //   // }]);

  //   console.log(res)
  // })
});

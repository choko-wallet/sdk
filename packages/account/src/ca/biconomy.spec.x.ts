// Copyright 2021-2022 @choko-wallet/abi authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { encodeContractCall } from '@choko-wallet/abi';

import { defaultAccountOption } from '../options';
import { EoaAccount } from '..';
import { ContractAccount } from './biconomy';

// import { encodeContractCall } from '@choko-wallet/abi';
globalThis.fetch = require('isomorphic-fetch');

const seed = 'humor cook snap sunny ticket distance leaf unusual join business obey below';

describe('@choko-wallet/account', function () {
  it('correctly fetch the CA address', async () => {
    const eoaAccount = new EoaAccount(defaultAccountOption);

    eoaAccount.unlock(seed);
    eoaAccount.init();

    const user = new ContractAccount(eoaAccount.toViemAccount(), 5);
    const addr = await user.getAddress();

    expect(addr).toBe('0x635DA47d95a2Ac4F30d6619B42D587d41fca1368');
  });

  // it('correctly send direct tx with CA', async () => {
  //   const linkTokenContract = '0x326c977e6efc84e512bb9c30f76e30c160ed06fb'
  //   const decimals = 18;

  //   const eoaAccount = new EoaAccount(defaultAccountOption);
  //   eoaAccount.unlock(seed);
  //   eoaAccount.init();

  //   // const walletClient = getWalletClient(5);
  //   // const res = await walletClient.sendTransaction({
  //   //   to: linkTokenContract,
  //     // data: encodeContractCall('erc20', 'transfer', [
  //     //   '0x635DA47d95a2Ac4F30d6619B42D587d41fca1368',
  //     //   BigInt(10) ** BigInt(decimals) * BigInt(10)
  //     // ]),
  //   //   chain: getViemChainConfig(5),
  //   //   account: eoaAccount.toViemAccount(),
  //   // })

  //   // console.log(res)
  //   const ca = new ContractAccount(eoaAccount.toViemAccount(), 5);
  //   // const deploy = await ca.deployContract();
  //   // console.log(deploy)

  //   const res = await ca.execute([{
  //     to: linkTokenContract,
  //     data: encodeContractCall('erc20', 'transfer', [
  //       '0x6B843808321e8E8Fe62cEf79aE63C828D60e496B',
  //       BigInt(10) ** BigInt(decimals - 1) * BigInt(1)
  //     ]),
  //   }, {
  //     to: linkTokenContract,
  //     data: encodeContractCall('erc20', 'transfer', [
  //       '0x6B843808321e8E8Fe62cEf79aE63C828D60e496B',
  //       BigInt(10) ** BigInt(decimals - 1) * BigInt(2)
  //     ]),
  //   }, {
  //     to: linkTokenContract,
  //     data: encodeContractCall('erc20', 'transfer', [
  //       '0x6B843808321e8E8Fe62cEf79aE63C828D60e496B',
  //       BigInt(10) ** BigInt(decimals - 1) * BigInt(3)
  //     ]),
  //   }]);

  //   console.log(res)
  // })

  it('correctly gasless tx with CA', async () => {
    const daiTokenContract = '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844';
    const decimals = 18;

    const eoaAccount = new EoaAccount(defaultAccountOption);

    eoaAccount.unlock(seed);
    eoaAccount.init();

    const ca = new ContractAccount(eoaAccount.toViemAccount(), 5);

    await ca.gaslessExecute([{
      to: daiTokenContract,
      data: encodeContractCall('erc20', 'transfer', [
        '0x635DA47d95a2Ac4F30d6619B42D587d41fca1368',
        BigInt(10) ** BigInt(decimals) * BigInt(1)
      ])
    }, {
      to: daiTokenContract,
      data: encodeContractCall('erc20', 'transfer', [
        '0x635DA47d95a2Ac4F30d6619B42D587d41fca1368',
        BigInt(10) ** BigInt(decimals) * BigInt(2)
      ])
    }, {
      to: daiTokenContract,
      data: encodeContractCall('erc20', 'transfer', [
        '0x635DA47d95a2Ac4F30d6619B42D587d41fca1368',
        BigInt(10) ** BigInt(decimals) * BigInt(3)
      ])
    }]);
  });
});

// Copyright 2021-2022 @choko-wallet/abi authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ethers } from 'ethers';

import { decodeContractCall, decodeTransaction, encodeContractCall, encodeTransaction, UnsignedTransaction } from '.';

describe('@choko-wallet/abi', function () {
  it('serde contract calls', () => {
    const callData = encodeContractCall(
      'payable-example', 'lock', [10]
    );

    const unsignedTx: UnsignedTransaction = {
      chainId: 0,
      data: callData,
      gasLimit: 2000000,
      to: '0x520035E74101150BA05D8A5aac837E38ae5416e2',
      value: ethers.utils.parseEther('0.1')
    };

    const result = encodeTransaction(unsignedTx);
    const r = decodeTransaction(result);

    // const call =
    decodeContractCall('payable-example', r);

    // console.log(r, call)
  });

  it('serde transfer', () => {
    const unsignedTx: UnsignedTransaction = {
      chainId: 0,
      gasLimit: 2000000,
      to: '0x520035E74101150BA05D8A5aac837E38ae5416e2',
      value: ethers.utils.parseEther('0.1')
    };

    const result = encodeTransaction(unsignedTx);

    // const r =
    decodeTransaction(result);
    // console.log(r)
  });
});

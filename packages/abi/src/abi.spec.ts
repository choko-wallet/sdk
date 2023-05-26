// Copyright 2021-2022 @choko-wallet/abi authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TransactionSerializable, parseEther } from 'viem';
import { decodeTransaction, encodeContractCall, encodeTransaction } from '.';

describe('@choko-wallet/abi', function () {
  it('encode erc20 calls', () => {
    const transfer = encodeContractCall('erc20', 'transfer', [
      '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      10000,
    ])
    console.log(transfer);
  });

  it('encode erc721 calls', () => {
    
    const transfer = encodeContractCall('erc721', 'transferFrom', [
      '0xdAC17F958D2ee523a2206206994597C13D831ec7', '0xdAC17F958D2ee523a2206206994597C13D831ec7', 1
    ])

    console.log(transfer);
  });

  it('serde transfer', () => {
    const unsignedTx: TransactionSerializable = {
      type: 'eip1559',
      chainId: 1,
      gas: BigInt(2000000),
      to: '0x520035E74101150BA05D8A5aac837E38ae5416e2',
      value: parseEther('0.1'),
    };

    const result = encodeTransaction(unsignedTx);
    const r = decodeTransaction(result);
    console.log(r)
  });

  it('serde erc20 transfer', () => {
    const unsignedTx: TransactionSerializable = {
      type: 'eip1559',
      chainId: 1,
      gas: BigInt(2000000),
      to: '0x520035E74101150BA05D8A5aac837E38ae5416e2',
      value: parseEther('0.1'),
      data: encodeContractCall('erc20', 'transfer', [
        '0x520035E74101150BA05D8A5aac837E38ae5416e2', 
        BigInt(10000)
      ])
    };

    const result = encodeTransaction(unsignedTx);
    const r = decodeTransaction(result);
    console.log(r)
  });
});

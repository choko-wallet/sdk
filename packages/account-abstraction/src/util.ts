// Copyright 2021-2022 @choko-wallet/account-abstraction authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Ported from @biconomy/common/ERC4337Utils.ts
// To be removed

import type { BiconomyUserOperation } from './types';

import { arrayify, defaultAbiCoder, keccak256 } from 'ethers/lib/utils';

// reverse "Deferrable" or "PromiseOrValue" fields
/* eslint-disable  @typescript-eslint/no-explicit-any */
export type NotPromise<T> = {
  [P in keyof T]: Exclude<T[P], Promise<any>>
}

/* eslint-disable  @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return */
function encode (typevalues: Array<{ type: string; val: any }>, forSignature: boolean): string {
  const types = typevalues.map((typevalue) =>
    typevalue.type === 'bytes' && forSignature ? 'bytes32' : typevalue.type
  );
  const values = typevalues.map((typevalue) =>
    typevalue.type === 'bytes' && forSignature ? keccak256(typevalue.val) : typevalue.val
  );

  return defaultAbiCoder.encode(types, values);
}

export function packUserOp (op: NotPromise<BiconomyUserOperation>, forSignature = true): string {
  if (forSignature) {
    // lighter signature scheme (must match UserOperation#pack): do encode a zero-length signature, but strip afterwards the appended zero-length value
    const userOpType = {
      components: [
        { name: 'sender', type: 'address' },
        { name: 'nonce', type: 'uint256' },
        { name: 'initCode', type: 'bytes' },
        { name: 'callData', type: 'bytes' },
        { name: 'callGasLimit', type: 'uint256' },
        { name: 'verificationGasLimit', type: 'uint256' },
        { name: 'preVerificationGas', type: 'uint256' },
        { name: 'maxFeePerGas', type: 'uint256' },
        { name: 'maxPriorityFeePerGas', type: 'uint256' },
        { name: 'paymasterAndData', type: 'bytes' },
        { name: 'signature', type: 'bytes' }
      ],
      name: 'userOp',
      type: 'tuple'
    };
    let encoded = defaultAbiCoder.encode([userOpType as any], [{ ...op, signature: '0x' }]);

    // remove leading word (total length) and trailing word (zero-length signature)
    encoded = '0x' + encoded.slice(66, encoded.length - 64);

    return encoded;
  }

  const typevalues = [
    { type: 'address', val: op.sender },
    { type: 'uint256', val: op.nonce },
    { type: 'bytes', val: op.initCode },
    { type: 'bytes', val: op.callData },
    { type: 'uint256', val: op.callGasLimit },
    { type: 'uint256', val: op.verificationGasLimit },
    { type: 'uint256', val: op.preVerificationGas },
    { type: 'uint256', val: op.maxFeePerGas },
    { type: 'uint256', val: op.maxPriorityFeePerGas },
    { type: 'bytes', val: op.paymasterAndData }
  ];

  if (!forSignature) {
    // for the purpose of calculating gas cost, also hash signature
    typevalues.push({ type: 'bytes', val: op.signature });
  }

  return encode(typevalues, forSignature);
}

export function getRequestId (
  op: NotPromise<BiconomyUserOperation>,
  entryPoint: string,
  chainId: number
): string {
  const userOpHash = keccak256(packUserOp(op, true));
  const enc = defaultAbiCoder.encode(
    ['bytes32', 'address', 'uint256'],
    [userOpHash, entryPoint, chainId]
  );

  return keccak256(enc);
}

export function getRequestIdForSigning (
  op: NotPromise<BiconomyUserOperation>,
  entryPoint: string,
  chainId: number
): Uint8Array {
  return arrayify(getRequestId(op, entryPoint, chainId));
}

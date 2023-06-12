// Copyright 2021-2023 @choko-wallet/abi authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { parseAbi } from 'viem';

export const AAFACTORY_ABI = parseAbi([
  'function createAccount(address owner, uint256 salt) public returns (address)',
  'function getAddress(address owner,uint256 salt) public view returns (address)'
] as const);

export const AAWALLET_ABI = parseAbi([
  'function getNonce() public view returns (uint256)',
  'function execute(address dest, uint256 value, bytes calldata func) external',
  'function executeBatch(address[] calldata dest, bytes[] calldata func) external'
] as const);

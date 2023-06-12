// Copyright 2021-2023 @choko-wallet/abi authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { parseAbi } from 'viem';

export const ENS_REGISTRY_ADDRESS = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';

export const ENS_ABI = parseAbi([
  'function resolver(bytes32 node) view returns (address)',
  'function owner(bytes32 node) view returns (address)',
  'function setSubnodeOwner(bytes32 node, bytes32 label, address owner)',
  'function setTTL(bytes32 node, uint64 ttl)',
  'function ttl(bytes32 node) view returns (uint64)',
  'function setResolver(bytes32 node, address resolver)',
  'function setOwner(bytes32 node, address owner)',
  'event Transfer(bytes32 indexed node, address owner)',
  'event NewOwner(bytes32 indexed node, bytes32 indexed label, address owner)',
  'event NewResolver(bytes32 indexed node, address resolver)',
  'event NewTTL(bytes32 indexed node, uint64 ttl)'
] as const);

export const GOERLI_PUBLIC_RESOLVER = '0xd7a4f6473f32ac2af804b3686ae8f1932bc35750';
export const RESOLVER_ABI = parseAbi([
  'function setAddr(bytes32 node, address a)'
] as const);

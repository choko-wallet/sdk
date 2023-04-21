// Copyright 2021-2023 @choko-wallet/abi authors & contributors
// SPDX-License-Identifier: Apache-2.0

export const ENS_REGISTRY_ADDRESS = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';

export const ENS_ABI = [
  'function setSubnodeOwner(bytes32 node, bytes32 label, address owner)',
  'function owner(bytes32 node) external view returns (address)',
  'function setOwner(bytes32 node, address owner)',
  'function setResolver(bytes32 node, address resolver)'
];

export const GOERLI_PUBLIC_RESOLVER = '0xd7a4f6473f32ac2af804b3686ae8f1932bc35750';
export const RESOLVER_ABI = [
  'function setAddr(bytes32 node, address a)'
];

// Copyright 2021-2023 @choko-wallet/ens authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { JsonRpcProvider } from '@ethersproject/providers';
import * as ethers from 'ethers';

// We assume that the you have the ownership of this ENS name
const ENS_REGISTRY_ADDRESS = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';
const ENS_ABI = [
  'function setSubnodeOwner(bytes32 node, bytes32 label, address owner)',
  'function owner(bytes32 node) external view returns (address)',
  'function setOwner(bytes32 node, address owner)',
  'function setResolver(bytes32 node, address resolver)'
];

const GOERLI_PUBLIC_RESOLVER = '0xd7a4f6473f32ac2af804b3686ae8f1932bc35750';
const RESOLVER_ABI = [
  'function setAddr(bytes32 node, address a)'
];

const encodeRegisterSubdomain = (subDomain: string, rootDomain: string, subDomainOwner: string): string => {
  const subNode = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(subDomain));
  const abiInterface = new ethers.utils.Interface(ENS_ABI);

  return abiInterface.encodeFunctionData('setSubnodeOwner', [
    ethers.utils.namehash(rootDomain), subNode, subDomainOwner
  ]);
};

const encodeSetResolve = (wholeName: string, resolver: string): string => {
  const node = ethers.utils.namehash(wholeName);
  const abiInterface = new ethers.utils.Interface(ENS_ABI);

  return abiInterface.encodeFunctionData('setResolver', [
    node, resolver
  ]);
};

const encodeSetEthAddr = (wholeName: string, addr: string): string => {
  const node = ethers.utils.namehash(wholeName);
  const abiInterface = new ethers.utils.Interface(RESOLVER_ABI);

  return abiInterface.encodeFunctionData('setAddr', [
    node, addr
  ]);
};

const resolveENSAddress = async (provider: JsonRpcProvider, ensName: string): Promise<string> => {
  return await provider.resolveName(ensName);
};

export { encodeRegisterSubdomain, resolveENSAddress, ENS_REGISTRY_ADDRESS, encodeSetResolve, encodeSetEthAddr, GOERLI_PUBLIC_RESOLVER };

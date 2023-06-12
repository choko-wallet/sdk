// Copyright 2021-2023 @choko-wallet/ens authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Address, Hex, PublicClient } from 'viem';

import { keccak256, toBytes } from 'viem';
import { namehash, normalize } from 'viem/ens';

import { encodeContractCall } from '@choko-wallet/abi';
import { ContractAccount } from '@choko-wallet/account';

// We assume that the you have the ownership of this ENS name
export const ENS_REGISTRY_ADDRESS: Address = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';
export const GOERLI_PUBLIC_RESOLVER: Address = '0xd7a4f6473f32ac2af804b3686ae8f1932bc35750';

export const encodeRegisterSubdomain = (subDomain: string, rootDomain: string, subDomainOwner: string): Hex => {
  return encodeContractCall('ens', 'setSubnodeOwner', [
    namehash(normalize(rootDomain)),
    keccak256(toBytes(normalize(subDomain))),
    subDomainOwner
  ]);
};

export const encodeSetResolve = (wholeName: string, resolver: Address): Hex => {
  return encodeContractCall('ens', 'setResolver', [
    namehash(normalize(wholeName)),
    resolver
  ]);
};

export const encodeSetEthAddr = (wholeName: string, addr: Address): Hex => {
  return encodeContractCall('ens-resolver', 'setAddr', [
    namehash(normalize(wholeName)),
    addr
  ]);
};

export const gaslessRegisterEns = async (rootDomainOwner: ContractAccount, subDomain: string, rootDomain: string, subDomainOwner: Address): Promise<void> => {
  const rootOwner = await rootDomainOwner.getAddress();
  const wholeName = `${subDomain}.${rootDomain}`;

  const register = {
    data: encodeRegisterSubdomain(subDomain, rootDomain, rootOwner),
    to: ENS_REGISTRY_ADDRESS
  };

  const setResolver = {
    data: encodeSetResolve(wholeName, GOERLI_PUBLIC_RESOLVER),
    to: ENS_REGISTRY_ADDRESS
  };

  const resolverRecord = {
    data: encodeSetEthAddr(wholeName, subDomainOwner),
    to: GOERLI_PUBLIC_RESOLVER
  };

  const transferToUser = {
    data: encodeRegisterSubdomain(subDomain, rootDomain, subDomainOwner),
    to: ENS_REGISTRY_ADDRESS
  };

  await rootDomainOwner.gaslessExecute([register, setResolver, resolverRecord, transferToUser]);
};

export const resolveEnsAddress = async (publicClient: PublicClient, name: string): Promise<Address> => {
  return await publicClient.getEnsAddress({
    name: normalize(name)
  });
};

export const resolveEnsName = async (publicClient: PublicClient, address: Address): Promise<string> => {
  return await publicClient.getEnsName({ address });
};

// Copyright 2021-2023 @choko-wallet/abi authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { parseAbi } from "viem";

export const ERC20_ABI = parseAbi([
  // basics
  'function name() public view returns (string memory)',
  'function symbol() public view returns (string memory)',
  'function decimals() public view returns (uint8)',
  'function totalSupply() public view returns (uint256)',
  'function balanceOf(address account) public view returns (uint256)',

  // balance related
  'function transfer(address to, uint256 amount) public returns (bool)',
  'function allowance(address owner, address spender) public view returns (uint256)',
  'function approve(address spender, uint256 amount) public returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) public returns (bool)',
  'function increaseAllowance(address spender, uint256 addedValue) public returns (bool)',
  'function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool)',
]);


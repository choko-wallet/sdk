// Copyright 2021-2023 @choko-wallet/abi authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { parseAbi } from "viem";

export const ERC721_ABI = parseAbi([
  // basics
  'function name() public view returns (string memory)',
  'function symbol() public view returns (string memory)',
  'function decimals() public view returns (uint8)',
  'function totalSupply() public view returns (uint256)',
  'function balanceOf(address account) public view returns (uint256)',
  'function ownerOf(uint256 tokenId) external view returns (address owner)',
  'function tokenURI(uint256 tokenId) public view returns (string memory)',

  // balance related
  'function transferFrom(address from, address to, uint256 tokenId) public',
  'function safeTransferFrom(address from, address to, uint256 tokenId) public',
  'function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public',
  
  'function approve(address to, uint256 tokenId) public',
  'function getApproved(uint256 tokenId) public view returns (address)',
  'function setApprovalForAll(address operator, bool approved) public',
  'function isApprovedForAll(address owner, address operator) public view returns (bool)',
])

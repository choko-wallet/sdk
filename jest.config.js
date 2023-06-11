// Copyright 2021-2022 @choko-wallet/base authors & contributors
// SPDX-License-Identifier: Apache-2.0

const config = require('@skyekiwi/dev/config/jest.cjs');

module.exports = Object.assign({}, config, {
  moduleNameMapper: {
    '@choko-wallet/abi(.*)$': '<rootDir>/packages/abi/src/$1',
    '@choko-wallet/account(.*)$': '<rootDir>/packages/account/src/$1',
    '@choko-wallet/auth-client(.*)$': '<rootDir>/packages/auth-client/src/$1',
    '@choko-wallet/core(.*)$': '<rootDir>/packages/core/src/$1',
    '@choko-wallet/ens(.*)$': '<rootDir>/packages/ens/src/$1',
    '@choko-wallet/mpc(.*)$': '<rootDir>/packages/mpc/src/$1',
    '@choko-wallet/rpc(.*)$': '<rootDir>/packages/rpc/src/$1',
    '@choko-wallet/sdk(.*)$': '<rootDir>/packages/sdk/src/$1',
    '@choko-wallet/token-price(.*)$': '<rootDir>/packages/token-price/src/$1'

  },
  modulePathIgnorePatterns: [
    '<rootDir>/packages/abi/build',
    '<rootDir>/packages/account/build',
    '<rootDir>/packages/core/build',
    '<rootDir>/packages/ens/build',
    '<rootDir>/packages/mpc/build',
    '<rootDir>/packages/rpc/build',
    '<rootDir>/packages/sdk/build',
    '<rootDir>/packages/auth-client/build',
    '<rootDir>/packages/token-price/build'
  ],
  testTimeout: 3_000_000,
  transformIgnorePatterns: [
    '/node_modules/(?!@polkadot|@skyekiwi|@adraffy|@babel/runtime/helpers/esm/)'
  ]
});

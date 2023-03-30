// Copyright 2021-2022 @choko-wallet/base authors & contributors
// SPDX-License-Identifier: Apache-2.0

const config = require('@skyekiwi/dev/config/jest.cjs');

module.exports = Object.assign({}, config, {
  moduleNameMapper: {
    '@choko-wallet/abi(.*)$': '<rootDir>/packages/abi/src/$1',
    '@choko-wallet/account-abstraction(.*)$': '<rootDir>/packages/account-abstraction/src/$1',
    '@choko-wallet/auth-client(.*)$': '<rootDir>/packages/auth-client/src/$1',
    '@choko-wallet/core(.*)$': '<rootDir>/packages/core/src/$1',
    '@choko-wallet/ens(.*)$': '<rootDir>/packages/ens/src/$1',
    '@choko-wallet/known-networks(.*)$': '<rootDir>/packages/known-networks/src/$1',
    '@choko-wallet/mpc(.*)$': '<rootDir>/packages/mpc/src/$1',
    '@choko-wallet/request-handler(.*)$': '<rootDir>/packages/request-handler/src/$1',
    '@choko-wallet/sdk(.*)$': '<rootDir>/packages/sdk/src/$1'
  },
  modulePathIgnorePatterns: [
    '<rootDir>/packages/abi/build',
    '<rootDir>/packages/account-abstraction/build',
    '<rootDir>/packages/core/build',
    '<rootDir>/packages/ens/build',
    '<rootDir>/packages/known-networks/build',
    '<rootDir>/packages/mpc/build',
    '<rootDir>/packages/request-handler/build',
    '<rootDir>/packages/sdk/build',
    '<rootDir>/packages/auth-client/build'
  ],
  testTimeout: 3_000_000,
  transformIgnorePatterns: [
    '/node_modules/(?!@polkadot|@skyekiwi|@adraffy|@babel/runtime/helpers/esm/)'
  ]
});

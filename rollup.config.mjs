// Copyright 2021-2022 @choko-wallet authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createBundle } from '@skyekiwi/dev/config/rollup.js';
import path from 'path';

const pkgs = [
  '@choko-wallet/abi',
  '@choko-wallet/account',
  '@choko-wallet/auth-client',
  '@choko-wallet/core',
  '@choko-wallet/ens',
  '@choko-wallet/mpc'
];

const external = [
  ...pkgs
];

const entries = [].reduce((all, p) => ({
  ...all,
  [`${p}`]: path.resolve(process.cwd(), `packages/${p}/build`)
}), {});

const overrides = {
  // '@polkadot/hw-ledger': {
  //   // these are all in the un-shakable and unused hdDerivation stuff from the Zondax libs, ignore
  //   entries: {
  //     'bip32-ed25519': path.resolve(process.cwd(), 'packages/x-bundle/build/empty.js'),
  //     bip39: path.resolve(process.cwd(), 'packages/x-bundle/build/empty.js'),
  //     blakejs: path.resolve(process.cwd(), 'packages/x-bundle/build/empty.js'),
  //     bs58: path.resolve(process.cwd(), 'packages/x-bundle/build/empty.js'),
  //     events: path.resolve(process.cwd(), 'packages/x-bundle/build/empty.js'),
  //     'hash.js': path.resolve(process.cwd(), 'packages/x-bundle/build/empty.js')
  //   }
  // },
  // '@polkadot/util-crypto': {
  //   entries: {
  //     '@polkadot/wasm-crypto': path.resolve(process.cwd(), 'node_modules/@polkadot/wasm-crypto/bundle.js'),
  //     'bn.js': path.resolve(process.cwd(), 'packages/x-bundle/build/bn.cjs'),
  //     buffer: path.resolve(process.cwd(), 'packages/x-bundle/build/buffer.js'),
  //     crypto: path.resolve(process.cwd(), 'packages/x-bundle/build/crypto.js')
  //   },
  //   inject: {
  //     Buffer: path.resolve(process.cwd(), 'packages/x-bundle/build/buffer.js'),
  //     crypto: path.resolve(process.cwd(), 'packages/x-bundle/build/crypto.js'),
  //     inherits: path.resolve(process.cwd(), 'packages/x-bundle/build/inherits.js')
  //   },
  //   polyfill: false
  // }
};

export default pkgs.map((pkg) => {
  const override = (overrides[pkg] || {});

  return createBundle({
    external,
    pkg,
    ...override,
    entries: {
      ...entries,
      ...(override.entries || {})
    }
  });
});

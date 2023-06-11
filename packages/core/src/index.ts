// Copyright 2021-2022 @choko-wallet/sdk authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { entropyToMnemonic } from '@polkadot/util-crypto/mnemonic/bip39';

import { DappDescriptor } from './dapp';
import { deserializeRequestError, mapRequestErrorToString, RequestError, RequestErrorSerializedLength, serializeRequestError } from './error';
import { compressParameters, decompressParameters, xxHash } from './util';

export {
  DappDescriptor,

  RequestError, RequestErrorSerializedLength, mapRequestErrorToString, serializeRequestError, deserializeRequestError,

  entropyToMnemonic, // re-export

  xxHash, compressParameters, decompressParameters
};

// Copyright 2021-2022 @choko-wallet/sdk authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { entropyToMnemonic } from '@polkadot/util-crypto/mnemonic/bip39';

import { IUserAccount, UserAccount } from './account';
import { AccountOption, defaultAccountOption, IAccountOption } from './accountOption';
import { DappDescriptor, IDappDescriptor } from './dapp';
import { deserializeRequestError, mapRequestErrorToString, RequestError, RequestErrorSerializedLength, serializeRequestError } from './error';
import { chainIdToProvider } from './etherProviders';
import { INetwork, KnownNetworks, Network } from './network';
import { IPayload, IRequest, IRequestHandlerDescriptor, IResponse } from './requestHandler';
import { compressParameters, decompressParameters, keypairTypeNumberToString, keypairTypeStringToNumber, xxHash } from './util';

export type {
  IUserAccount, IAccountOption,
  IDappDescriptor,
  INetwork, KnownNetworks,
  IPayload, IRequestHandlerDescriptor, IRequest, IResponse
};

export {
  UserAccount, AccountOption, defaultAccountOption,

  DappDescriptor,

  Network,

  RequestError, RequestErrorSerializedLength, mapRequestErrorToString, serializeRequestError, deserializeRequestError,

  entropyToMnemonic, // re-export

  chainIdToProvider,

  keypairTypeNumberToString, keypairTypeStringToNumber, xxHash, compressParameters, decompressParameters
};

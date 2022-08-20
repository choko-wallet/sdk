// Copyright 2021-2022 @choko-wallet/sdk authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { hexToU8a } from '@skyekiwi/util';

import { decompressParameters } from '@choko-wallet/core/util';
import { ConnectDappResponse, SignMessageResponse, SignTxResponse } from '@choko-wallet/request-handler';

export const parseConnectDappResponse = (data: string): ConnectDappResponse => {
  const response = ConnectDappResponse.deserialize(
    decompressParameters(hexToU8a(data))
  );

  return response;
};

export const parseSignMessageResponse = (data: string): SignMessageResponse => {
  const response = SignMessageResponse.deserialize(
    decompressParameters(hexToU8a(data))
  );

  return response;
};

export const parseSignTxResponse = (data: string): SignTxResponse => {
  const response = SignTxResponse.deserialize(
    decompressParameters(hexToU8a(data))
  );

  return response;
};

// Copyright 2021-2022 @choko-wallet/core authors & contributors
// SPDX-License-Identifier: Apache-2.0

export enum RequestError {
  NoError,
  AccountLocked,
  SerdeLengthError,
  Unexpected,
  Unknown,
}

export const RequestErrorSerializedLength = 2;

export function mapRequestErrorToString (error: RequestError): string {
  switch (error) {
    case RequestError.NoError:
      return 'None';

    case RequestError.AccountLocked:
      return 'AccountLocked';

    case RequestError.SerdeLengthError:
      return 'SerdeLengthError';

    case RequestError.Unknown:
      return 'Unknown';

    case RequestError.Unexpected:
      return 'Unexpected';

    default:
      throw new Error('unknown error - Util.mapRequestErrorToString');
  }
}

export function serializeRequestError (error: RequestError): Uint8Array {
  return new Uint8Array([error, error]);
}

export function deserializeRequestError (data: Uint8Array): RequestError {
  if (data.length !== RequestErrorSerializedLength) {
    return RequestError.Unexpected;
  }

  return data[0];
}

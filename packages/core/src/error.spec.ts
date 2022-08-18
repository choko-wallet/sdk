// Copyright 2021-2022 @choko-wallet/core authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { deserializeRequestError, RequestError, serializeRequestError } from './error';

describe('error - @choko-wallet/core/account', function () {
  it('RequestError - serde', () => {
    [
      RequestError.NoError,
      RequestError.AccountLocked,
      RequestError.SerdeLengthError,
      RequestError.Unexpected,
      RequestError.Unknown
    ].map((e) => {
      const data = serializeRequestError(e);

      expect(data.length).toBe(2);
      expect(deserializeRequestError(data)).toBe(e);

      return true;
    });
  });
});

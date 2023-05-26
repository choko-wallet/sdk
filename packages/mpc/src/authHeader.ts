// Copyright 2021-2022 @choko-wallet/app-utils authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Certificate } from '@choko-wallet/auth-client/types';

import { u8aToHex } from '@skyekiwi/util';

const certificateToAuthHeader = (primary: Certificate, secondary: Certificate, additional?: Certificate): string => {
  const additionalCert = additional
    ? {
      payload: u8aToHex(additional.payload),
      signature: u8aToHex(additional.signature)
    }
    : null;

  return JSON.stringify({
    additional: additionalCert,
    primary: {
      payload: u8aToHex(primary.payload),
      signature: u8aToHex(primary.signature)
    },
    secondary: {
      payload: u8aToHex(secondary.payload),
      signature: u8aToHex(secondary.signature)
    }
  });
};

export { certificateToAuthHeader };

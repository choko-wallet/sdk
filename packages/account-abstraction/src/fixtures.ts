// Copyright 2021-2022 @choko-wallet/account-abstraction authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BiconomyFixture } from './types';

const biconomyFixtures: BiconomyFixture = {
  1: {
    entryPointAddress: '0x119df1582e0dd7334595b8280180f336c959f3bb',
    fallbackHandlerAddress: '0xf05217199f1c25604c67993f11a81461bc97f3ab',
    multiSendAddress: '0x2f65bed438a30827d408b7c6818ec5a22c022dd1',
    walletFactoryAddress: '0xf59cda6fd211303bfb79f87269abd37f565499d8'
  },
  137: {
    entryPointAddress: '0x119df1582e0dd7334595b8280180f336c959f3bb',
    fallbackHandlerAddress: '0x0bc0c08122947be919a02f9861d83060d34ea478',
    multiSendAddress: '0xa1677d8c8edb188e49ecd832236af281d6b0b20e',
    walletFactoryAddress: '0xf59cda6fd211303bfb79f87269abd37f565499d8'
  },
  5: {
    entryPointAddress: '0x119df1582e0dd7334595b8280180f336c959f3bb',
    fallbackHandlerAddress: '0x0bc0c08122947be919a02f9861d83060d34ea478',
    multiSendAddress: '0x2f65bed438a30827d408b7c6818ec5a22c022dd1',
    walletFactoryAddress: '0xf59cda6fd211303bfb79f87269abd37f565499d8'
  },
  56: {
    entryPointAddress: '0x119df1582e0dd7334595b8280180f336c959f3bb',
    fallbackHandlerAddress: '0xf05217199f1c25604c67993f11a81461bc97f3ab',
    multiSendAddress: '0x2f65bed438a30827d408b7c6818ec5a22c022dd1',
    walletFactoryAddress: '0xf59cda6fd211303bfb79f87269abd37f565499d8'
  },
  80001: {
    entryPointAddress: '0x119df1582e0dd7334595b8280180f336c959f3bb',
    fallbackHandlerAddress: '0x0bc0c08122947be919a02f9861d83060d34ea478',
    multiSendAddress: '0x2f65bed438a30827d408b7c6818ec5a22c022dd1',
    walletFactoryAddress: '0xf59cda6fd211303bfb79f87269abd37f565499d8'
  },
  97: {
    entryPointAddress: '0x119df1582e0dd7334595b8280180f336c959f3bb',
    fallbackHandlerAddress: '0xf05217199f1c25604c67993f11a81461bc97f3ab',
    multiSendAddress: '0x2f65bed438a30827d408b7c6818ec5a22c022dd1',
    walletFactoryAddress: '0xf59cda6fd211303bfb79f87269abd37f565499d8'
  }
};

const biconomyServicesUrl = {
  biconomyRelayService: 'https://sdk-relayer.prod.biconomy.io/api/v1/relay',
  biconomySigningService: 'https://us-central1-biconomy-staging.cloudfunctions.net/signing-service',
  biconomyGaslessTxListener: 'wss://sdk-ws.prod.biconomy.io/connection/websocket'
};

export { biconomyFixtures, biconomyServicesUrl };

// Copyright 2021-2022 @choko-wallet/swing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import SwingSDK, { Components, Options, TransferParams, TransferRoute } from '@swing.xyz/sdk';
import EventEmitter from 'events';

export const initSwing = async (options?: Options): Promise<{
  sdk: SwingSDK
  eventEmitter: EventEmitter
}> => {
  const sdk = new SwingSDK(options);

  await sdk.init();
  const eventEmitter = new EventEmitter();

  sdk.on('TRANSFER', (status) => eventEmitter.emit('TRANSFER', status));
  sdk.on('READY', () => eventEmitter.emit('READY'));

  return {
    eventEmitter,
    sdk
  };
};

export const connectWallet = async (sdk: SwingSDK, provider: any, chainSlug: Components.Schemas.ChainSlug): void => {
  await sdk.wallet.connect(provider, chainSlug);
};

export const getQuote = async (sdk: SwingSDK, transferParams: TransferParams): any => {
  const quote = await sdk.getQuote(transferParams);

  return quote;
};

export const transfer = async (sdk: SwingSDK, transferParams: TransferParams, transferRoute: TransferRoute): void => {
  await sdk.transfer(transferRoute, transferParams);
};

export const getTransactionHistory = async (sdk: SwingSDK, address: string): any => {
  return await sdk.wallet.getTransactions(address);
};

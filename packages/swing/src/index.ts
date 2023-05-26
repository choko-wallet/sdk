// Copyright 2021-2022 @choko-wallet/swing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import SwingSDK, { Components, Options, Transaction, TransferParams, TransferRoute, WalletProvider } from '@swing.xyz/sdk';
import EventEmitter from 'events';

import { QuoteType } from './types';

export const initSwing = async (options?: Options): Promise<{
  sdk: SwingSDK
  eventEmitter: EventEmitter
}> => {
  const sdk: SwingSDK = new SwingSDK(options);

  await sdk.init();
  const eventEmitter = new EventEmitter();

  sdk.on('TRANSFER', (status) => eventEmitter.emit('TRANSFER', status));
  sdk.on('READY', () => eventEmitter.emit('READY'));

  return {
    eventEmitter,
    sdk
  };
};

export const connectWallet = async (sdk: SwingSDK, provider: WalletProvider, chainSlug: Components.Schemas.ChainSlug): void => {
  await sdk.wallet.connect(provider, chainSlug);
};

export const getQuote = async (sdk: SwingSDK, transferParams: TransferParams): QuoteType => {
  const quote: QuoteType = await sdk.getQuote(transferParams);

  return quote;
};

export const transfer = async (sdk: SwingSDK, transferParams: TransferParams, transferRoute: TransferRoute): void => {
  await sdk.transfer(transferRoute, transferParams);
};

export const getTransactionHistory = async (sdk: SwingSDK, address: string): Promise<Transaction[]> => {
  return await sdk.wallet.getTransactions(address);
};

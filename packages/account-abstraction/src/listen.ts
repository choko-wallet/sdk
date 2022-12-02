// Copyright 2021-2022 @choko-wallet/account-abstraction authors & contributors
// SPDX-License-Identifier: Apache-2.0

export {};

// import { hexToU8a } from '@skyekiwi/util';
// import WebSocket from 'isomorphic-ws';
// import { ClientMessenger } from 'messaging-sdk';

// import { biconomyServicesUrl } from './fixtures';

// export const listenGaslessTxResult = async (
//   transactionId: string
// ): Promise<[Uint8Array, number]> => {
//   const clientMessenger = new ClientMessenger(
//     biconomyServicesUrl.biconomyGaslessTxListener,
//     WebSocket
//   );

//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve([new Uint8Array(32), 0]);
//     }, 3000);
//     clientMessenger.createTransactionNotifier(transactionId, {
//       onError: (tx: any) => {
//         // clientMessenger.unsubscribe(transactionId);
//         reject(tx.error);
//         console.log(`Error message received at client is ${tx}`);
//       },
//       onHashChanged: (tx: any) => {
//         // clientMessenger.unsubscribe(transactionId);
//         console.log('onHashChanged', tx);
//         resolve(
//           [hexToU8a(tx.transactionHash.slice(2)), 0]
//         );
//       },
//       onHashGenerated: (tx: any) => {
//         // clientMessenger.unsubscribe(transactionId);
//         console.log('onHashGenerated', tx);
//         resolve(
//           [hexToU8a(tx.transactionHash.slice(2)), 0]
//         );
//       },
//       onMined: (tx: any) => {
//         // clientMessenger.unsubscribe(transactionId);
//         console.log('onMined', tx);
//         resolve(
//           [hexToU8a(tx.transactionHash.slice(2)), 0]
//         );
//       }
//     });
//   });
// };

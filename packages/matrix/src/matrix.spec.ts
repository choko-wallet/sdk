// Copyright 2021-2022 @choko-wallet/matrix authors & contributors
// SPDX-License-Identifier: Apache-2.0

import dotenv from 'dotenv';
import { MatrixClient } from 'matrix-js-sdk';
import { logger } from 'matrix-js-sdk/lib/logger';

import { createPrivateRoom, loginWithUserPassword, registerClientEventListener, removeEventListeners, sendMessage, startClient } from './index';

logger.disableAll();
dotenv.config();

const BASE_URL = 'https://matrix.org';

describe('@choko-wallet/matrix', () => {
  let bob: MatrixClient, alice: MatrixClient, charlie: MatrixClient;
  let aliceHandlers: any = {};
  const charlieHandlers: any = {};

  const aliceMQ: string[] = [];

  beforeAll(async () => {
    bob = await loginWithUserPassword(BASE_URL, process.env.USER_ID_BOB, process.env.PASSWORD_BOB);
    alice = await loginWithUserPassword(BASE_URL, process.env.USER_ID_ALICE, process.env.PASSWORD_ALICE);
    charlie = await loginWithUserPassword(BASE_URL, process.env.USER_ID_CHARLIE, process.env.PASSWORD_CHARLIE);
    console.log(bob.getUserId());
    console.log(alice.getUserId());
    console.log(charlie.getUserId());
    aliceHandlers = registerClientEventListener(alice, {
      invite: async ({ member }) => {
        await alice.joinRoom(member.roomId);
        console.log('Alice joined: ', member.roomId);
      },
      msg: ({ content, roomId, toStartOfTimeline }) => {
        console.log('QQQ', roomId, content, toStartOfTimeline);
        aliceMQ.push(content.body);
      }
    });
    await startClient(bob);
    await startClient(alice);
    await startClient(charlie);
  });
  afterAll(() => {
    console.log('Destructuring ...');
    removeEventListeners(alice, aliceHandlers);
    removeEventListeners(charlie, charlieHandlers);
    bob.stopClient();
    alice.stopClient();
    charlie.stopClient();
  });

  it('Check room creation and message send & receive', async () => {
    const roomId = await createPrivateRoom(bob, 'TestChat2', [alice.getUserId(), charlie.getUserId()]);

    console.log('Message is sending...');
    await sendMessage(bob, roomId, 'm.text', 'Hello!');
    console.log('Message sent');
    await (() => new Promise((resolve) => setTimeout(() => resolve({}), 1000)))();
    expect(aliceMQ).toEqual(['Hello!']);
  }, 10000);
});

// Copyright 2021-2022 @choko-wallet/matrix authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as matrix from 'matrix-js-sdk';
import { ClientEvent, Direction, EmittedEvents, ICreateClientOpts, MatrixClient, MatrixEvent, Preset, Room, RoomEvent, RoomMember, RoomMemberEvent } from 'matrix-js-sdk';

import { InviteEventParam, Listeners, MessageEventParam } from './types';

const wrapOnInvite = (callback: (event: InviteEventParam) => void) => ({
  eventName: RoomMemberEvent.Membership,
  handler: (event: MatrixEvent, member: RoomMember, oldMembership?: string) => {
    callback({ member, oldMembership });
  }
});

const wrapOnMessage = (callback: (event: MessageEventParam) => void) => ({
  eventName: RoomEvent.Timeline,
  handler: (event: MatrixEvent, room: Room, toStartOfTimeline: string) => {
    if (event.getType() !== 'm.room.message') {
      return;
    }

    callback({ content: event.event.content, roomId: room.roomId, toStartOfTimeline });
  }
});

const matrixEventWrapper = {
  invite: wrapOnInvite,
  msg: wrapOnMessage
};

export const login = async (opts: ICreateClientOpts): any => {
  const client = matrix.createClient(opts);

  await client.startClient();

  return client;
};

export const loginWithUserPassword = async (baseUrl: string, userid: string, password: string): any => {
  const client = matrix.createClient({ baseUrl });

  await client.login('m.login.password', { user: userid, password: password });

  // await client.startClient()
  return client;
};

export const startClient = async (client: MatrixClient): void => {
  await client.startClient();
  await (() => new Promise((resolve, reject) => {
    client.once(ClientEvent.Sync, async function () {
      console.log('The client is ready.');
      resolve({});
    });
  }));
};

export const invite = async (client: MatrixClient, roomId: string, userId: string, reason: string): void => {
  await client.invite(roomId, userId, reason);
};

export const createPrivateRoom = async (client: MatrixClient, roomName?: string, initialUsers?: string[]) => {
  const { room_id } = await client.createRoom({
    invite: initialUsers
    name: roomName,
    preset: Preset.PrivateChat,
  });

  return room_id;
};

export const sendMessage = async (client: MatrixClient, roomId: string, msgtype: string, body: any) => {
  const content = {
    body,
    msgtype
  };
  const response = await client.sendEvent(roomId, 'm.room.message', content, '');

  return response;
};

export const createMessagesRequest = async (client: MatrixClient, roomId: string, limit: number, dir: Direction/*, timelineFilter: Filter */): Promise<any> => {
  const response = await client.createMessagesRequest(roomId, null, limit, dir);

  return response;
};

export const registerClientEventListener = (client: MatrixClient, listeners: Listeners) => {
  let key: keyof (typeof listeners);
  const allHandlers: {
    [event: string]: (...args: any[]) => void
  } = {};

  for (key in listeners) {
    const listener = listeners[key];
    const { eventName, handler } = matrixEventWrapper[key](listener as any);

    client.on(eventName as any, handler);
    allHandlers[eventName] = handler;
  }

  return allHandlers;
};

export const removeEventListeners = (client: MatrixClient, listeners: Record<string, () => void>) => {
  let eventName: keyof (typeof listeners);

  for (eventName in listeners) {
    client.off(eventName as EmittedEvents, listeners[eventName]);
  }
};

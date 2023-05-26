// Copyright 2021-2022 @choko-wallet/matrix authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IContent, RoomMember } from 'matrix-js-sdk';

export type InviteEventParam = {
  member: RoomMember,
  oldMembership?: string
}
export type MessageEventParam = {
  roomId: string,
  content: IContent,
  toStartOfTimeline: string
}

export type Listeners = {
  'invite'?: (event: InviteEventParam) => void,
  'msg'?: (event: MessageEventParam) => void
}

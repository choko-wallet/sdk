import * as matrix from "matrix-js-sdk";
import { MatrixClient, ICreateClientOpts, Preset, RoomMemberEvent, Direction, EmittedEvents, RoomEvent, MatrixEvent, RoomMember, ClientEvent, Room } from "matrix-js-sdk";
import { InviteEventParam, MessageEventParam, Listeners } from './types'

const wrapOnInvite = (callback: (event: InviteEventParam) => void) => ({
  eventName: RoomMemberEvent.Membership,
  handler: (event: MatrixEvent, member: RoomMember, oldMembership?: string) => {
    callback({ member, oldMembership })
  }
})

const wrapOnMessage = (callback: (event: MessageEventParam) => void) => ({
  eventName: RoomEvent.Timeline,
  handler: (event: MatrixEvent, room: Room, toStartOfTimeline: string) => {
    if (event.getType() !== "m.room.message") {
      return;
    }
    callback({ roomId: room.roomId, content: event.event.content, toStartOfTimeline })
  }
})

const matrixEventWrapper = {
  "invite": wrapOnInvite,
  "msg": wrapOnMessage
}

export const login = async (opts: ICreateClientOpts) => {
  const client = matrix.createClient(opts)
  await client.startClient()
  return client
}

export const loginWithUserPassword = async (baseUrl: string, userid: string, password: string) => {
  const client = matrix.createClient({ baseUrl })
  await client.login("m.login.password", {"user": userid, "password": password})
  // await client.startClient()
  return client
}

export const startClient = async(client: MatrixClient) => {
  await client.startClient();
  await (() => new Promise((resolve, reject) => {
    client.once(ClientEvent.Sync, async function (state, prevState, res) {
      console.log("The client is ready.");
      resolve({})
    })
  }))
}

export const invite = async (client: MatrixClient, roomId: string, userId: string, reason: string) => {
  await client.invite(roomId, userId, reason)
}

export const createPrivateRoom = async (client: MatrixClient, roomName?: string, initialUsers?: string[]) => {
  const { room_id } = await client.createRoom({
    preset: Preset.PrivateChat,
    name: roomName,
    invite: initialUsers
  })
  return room_id
}

export const sendMessage = async (client: MatrixClient, roomId: string, msgtype: string, body: any) => {
  const content = {
    body,
    msgtype
  };
  const response = await client.sendEvent(roomId, "m.room.message", content, "");
  return response
}

export const createMessagesRequest = async (client: MatrixClient, roomId: string, limit: number, dir: Direction/*, timelineFilter: Filter*/): Promise<any> => {
  const response = await client.createMessagesRequest(roomId, null, limit, dir)
  return response
}

export const registerClientEventListener = (client: MatrixClient, listeners: Listeners) => {
  let key: keyof (typeof listeners)
  let allHandlers: {
    [event: string]: (...args: any[]) => void
  } = {}
  for (key in listeners) {
    const listener = listeners[key]
    const t = matrixEventWrapper[key]
    const { eventName, handler } = matrixEventWrapper[key](listener as any)
    client.on(eventName as any, handler)
    allHandlers[eventName] = handler
  }
  return allHandlers
}

export const removeEventListeners = (client: MatrixClient, listeners: Record<string, () => void>) => {
  let eventName: keyof (typeof listeners)
  for (eventName in listeners) {
    client.off(eventName as EmittedEvents, listeners[eventName])
  }
}
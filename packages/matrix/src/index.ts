import * as matrix from "matrix-js-sdk";
import { MatrixClient, ICreateClientOpts, Preset, RoomEvent, Direction, Filter, EventTimelineSet, Room, IPaginateOpts } from "matrix-js-sdk";


export class MatrixRoom {
    user: MatrixUser
    roomId: string = ""

    constructor(user: MatrixUser, roomId: string) {
        this.user = user
        this.roomId = roomId
    }

    getClient = () => this.user.client

    sendMessage = async (msgtype: string, body: any) => {
        const content = {
            body,
            msgtype
        };
        const response = await this.getClient().sendEvent(this.roomId, "m.room.message", content, "");
        return response
    }
    getMessageHistory = async (limit: number, dir: Direction/*, timelineFilter: Filter*/): Promise<any> => {
        // const client = this.getClient()
        // const timelineSet: EventTimelineSet = new EventTimelineSet(
        //     new Room(this.roomId, client, client.getUserId()),
        //     {},
        //     client
        // )
        // const latestTimeline = await this.getClient().getLatestTimeline(timelineSet)
        // const paginationOpts: IPaginateOpts = {
        //     backwards: dir === 'f',
        //     limit: limit
        // }
        // await client.paginateEventTimeline(latestTimeline, paginationOpts)
        const response = await this.getClient().createMessagesRequest(this.roomId, null, limit, dir)
        return response
    }
    invite = async (roomId: string, userId: string, reason: string) => {
        await this.getClient().invite(roomId, userId, reason)
    }
}

export class MatrixUser {

    client: MatrixClient | null = null

    constructor() {
    }

    connect = async (opts: ICreateClientOpts) => {
        this.client = matrix.createClient(opts)
        await this.client.startClient()
    }
    connectWithUserPassword = async (baseUrl: string, userid: string, password: string) => {
        this.client = matrix.createClient({ baseUrl })
        await this.client.login("m.login.password", {"user": userid, "password": password})
        this.client.startClient()
    }

    createPrivateRoom = async (initialUsers: string[]): Promise<MatrixRoom> => {
        if(this.client === null) throw new Error("Matrix client is not initialized.")
        const { room_id } = await this.client.createRoom({
            preset: Preset.PrivateChat,
            invite: initialUsers
        })
        return new MatrixRoom(this, room_id)
    }

    getAllPendingInviations = async () => {
        return await new Promise((resolve, reject) => {
            this.client.on("RoomMember.membership", async function (event: any, member: any) {
                if (member.membership === "invite") {
                    // await client.joinRoom(member.roomId);
                    console.log("userid / room_id", member.userId, member.roomId);
                }
            });
        })
    }

    getUserId = () => {
        return this.client.getUserId()
    }
}
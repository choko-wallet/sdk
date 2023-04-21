import { loginWithUserPassword, createPrivateRoom, registerClientEventListener, removeEventListeners, startClient, sendMessage, createMessagesRequest } from './index'
import dotenv from 'dotenv';
import { Direction, MatrixClient } from 'matrix-js-sdk';

dotenv.config();

const BASE_URL = 'https://matrix.org'

describe('@choko-wallet/matrix', () => {
    let bob: MatrixClient
    let bobHandlers: any = {}

    let aliceMQ: string[] = []
    beforeAll(async () => {
        bob = await loginWithUserPassword(BASE_URL, process.env.USER_ID_BOB, process.env.PASSWORD_BOB)
        console.log(bob.getUserId())
        bobHandlers = registerClientEventListener(bob, {
            "invite": async ({ member }) => {
                await bob.joinRoom(member.roomId)
                console.log("Bob joined: ", member.roomId);
            },
            "msg": ({ roomId, content, toStartOfTimeline }) => {
                console.log("QQQ", roomId, content, toStartOfTimeline)
                aliceMQ.push(content.body)
            },
        })
        await startClient(bob);

    })
    afterAll(async() => {
        console.log("Destructuring ...")
        removeEventListeners(bob, bobHandlers)
        bob.stopClient()
    })

    it('Check for message pulling', async () => {
        const responses = await createMessagesRequest(bob, "!rKmdlujVgrcrdKHulu:matrix.org", 2, Direction.Forward)
        console.log(responses)
    }, 10000)
})
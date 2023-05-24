import { loginWithUserPassword, createPrivateRoom, registerClientEventListener, removeEventListeners, startClient, sendMessage } from './index'
import dotenv from 'dotenv';
import { MatrixClient } from 'matrix-js-sdk';
import { logger } from 'matrix-js-sdk/lib/logger';

logger.disableAll();
dotenv.config();

const BASE_URL = 'https://matrix.org'

describe('@choko-wallet/matrix', () => {
  let bob: MatrixClient, alice: MatrixClient, charlie: MatrixClient
  let aliceHandlers: any = {}
  let charlieHandlers: any = {}

  let aliceMQ: string[] = []
  beforeAll(async () => {
    bob = await loginWithUserPassword(BASE_URL, process.env.USER_ID_BOB, process.env.PASSWORD_BOB)
    alice = await loginWithUserPassword(BASE_URL, process.env.USER_ID_ALICE, process.env.PASSWORD_ALICE)
    charlie = await loginWithUserPassword(BASE_URL, process.env.USER_ID_CHARLIE, process.env.PASSWORD_CHARLIE)
    console.log(bob.getUserId())
    console.log(alice.getUserId())
    console.log(charlie.getUserId())
    aliceHandlers = registerClientEventListener(alice, {
      "invite": async ({ member }) => {
          await alice.joinRoom(member.roomId)
          console.log("Alice joined: ", member.roomId);
      },
      "msg": ({ roomId, content, toStartOfTimeline }) => {
          console.log("QQQ", roomId, content, toStartOfTimeline)
          aliceMQ.push(content.body)
      },
    })
    await startClient(bob);
    await startClient(alice);
    await startClient(charlie);
  })
  afterAll(async() => {
    console.log("Destructuring ...")
    removeEventListeners(alice, aliceHandlers)
    removeEventListeners(charlie, charlieHandlers)
    bob.stopClient()
    alice.stopClient()
    charlie.stopClient()
  })

  it('Check room creation and message send & receive', async () => {
    const roomId = await createPrivateRoom(bob, "TestChat2", [ alice.getUserId(), charlie.getUserId() ])
    console.log("Message is sending...")
    await sendMessage(bob, roomId, "m.text", "Hello!")
    console.log("Message sent")
    await (() => new Promise((resolve, reject) => setTimeout(() => resolve({}), 1000)))()
    expect(aliceMQ).toEqual(["Hello!"])
  }, 10000)
})
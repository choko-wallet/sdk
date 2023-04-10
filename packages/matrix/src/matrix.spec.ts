import { MatrixUser, MatrixRoom } from './index'
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = 'https://matrix.org'

describe('@choko-wallet/matrix', () => {
    it('Check matrix package', async () => {
        const bob = new MatrixUser()
        await bob.connectWithUserPassword(BASE_URL, "michaelchilelli", "Kevin.Mitnick.45")

        // const alice = new MatrixUser()
        // await alice.connect({
        //     baseUrl: "https://matrix.org",
        //     accessToken: process.env.ACCESS_TOKEN_ALICE,
        //     userId: process.env.USER_ID_BOB
        // })

        // const charlie = new MatrixUser()
        // await charlie.connect({
        //     baseUrl: "https://matrix.org",
        //     accessToken: process.env.ACCESS_TOKEN_CHARLIE,
        //     userId: process.env.USER_ID_BOB
        // })

        // const room = await bob.createPrivateRoom([ alice.getUserId() ])
        // await alice.getAllPendingInviations()
    })
})
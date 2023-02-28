import superagent from "superagent";
import blake from 'blakejs'
import { AUTH_SERVER_URL } from "./config";


export async function validateProofOfOwnership(provider: string, email: string, token: string) {
    const certificate = await superagent.post(`${AUTH_SERVER_URL}/auth/oauth/validate`).send({ provider, email, token }).accept('json');
    return certificate
}

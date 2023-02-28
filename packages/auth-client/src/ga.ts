import superagent from "superagent";
import blake from 'blakejs'
import { AUTH_SERVER_URL } from "./config";

export async function initProofOfOwnership(email: string) {
    const gaToken = await superagent.post(`${AUTH_SERVER_URL}/auth/ga/init`);
    return gaToken
}

export async function validateProofOfOwnership(gaToken: string, code: string) {
    const gaHash = blake.blake2sHex(gaToken)
    const codeHex = code.split("").map((chr) => Number(chr).toString(16).padStart(2, '0')).join("")
    const certificate = await superagent.post(`${AUTH_SERVER_URL}/auth/ga/validate`).send({ ga_hash: gaHash, code: codeHex }).accept('json');
    return certificate
}

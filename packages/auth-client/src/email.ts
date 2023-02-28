import superagent from "superagent";
import blake from 'blakejs'
import { AUTH_SERVER_URL } from "./config";

export async function initProofOfOwnership(email: string) {
    const res = await superagent.post(`${AUTH_SERVER_URL}/auth/email/init`).send({ email: email });
    // response is a dummy string
    // console.log(res);
    return res
}

export async function validateProofOfOwnership(email: string, code: string) {
    const emailHash = blake.blake2sHex(email)
    const codeHex = code.split("").map((chr) => Number(chr).toString(16).padStart(2, '0')).join("")
    const certificate = await superagent.post(`${AUTH_SERVER_URL}/auth/email/validate`).send({ email_hash: emailHash, code: codeHex }).accept("json");
    return certificate
}

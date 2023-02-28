import superagent from "superagent";
import blake from 'blakejs'
import { AUTH_SERVER_URL, KEYGEN_ID_LEN } from "./config";

export function generateKeygenID() {
    return Array.from({length: KEYGEN_ID_LEN}, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join("")
}
export async function linkUsage(keygen_id: string, ownership_proof: any) {
    const certification = 
        await superagent.post(`${AUTH_SERVER_URL}/usage/link`)
            .send({
                keygen_id: keygen_id,
                ownership_proof: JSON.stringify(ownership_proof)
            }).accept("json");
    return certification
}

export async function validateUsage(keygen_id: string, credential_hash: string, usage_certification: any) {
    const certificate =
        await superagent.post(`${AUTH_SERVER_URL}/usage/validate`)
            .send({
                keygen_id: keygen_id,
                credential_hash: credential_hash,
                usage_certification: JSON.stringify(usage_certification)
            }).accept('json');
    return certificate
}

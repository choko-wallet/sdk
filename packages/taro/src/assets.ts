import * as superagent from 'superagent';
import * as fs from 'fs';
import * as https from 'https';

import { TARO_SERVER_URL, MACAROON_PATH } from './config';
import { TaroAssets, MintRequest } from './types';

export async function getAssetsList (): Promise<string> {
  const agent = new https.Agent({ rejectUnauthorized: false });

  const res = await superagent
    .get(`${TARO_SERVER_URL}/v1/taproot-assets/assets`)
    .agent(agent)
    .type('application/json')
    .set('Grpc-Metadata-macaroon', fs.readFileSync(MACAROON_PATH).toString('hex'));

    return res.text;
}

export async function mintAsset (asset: TaroAssets, enable_emission: boolean): Promise<string> {
  const agent = new https.Agent({ rejectUnauthorized: false });

  const res = await superagent
    .post(`${TARO_SERVER_URL}/v1/taproot-assets/assets`)
    .agent(agent)
    .type('application/json')
    .set('Grpc-Metadata-macaroon', fs.readFileSync(MACAROON_PATH).toString('hex'))
    .send({
      asset,
      enable_emission
    } as MintRequest);

    return res.text;
}

export async function finalizeMintAsset (): Promise<string> {
  const agent = new https.Agent({ rejectUnauthorized: false });

  const res = await superagent
    .post(`${TARO_SERVER_URL}/v1/taproot-assets/assets/mint/finalize`)
    .agent(agent)
    .type('application/json')
    .set('Grpc-Metadata-macaroon', fs.readFileSync(MACAROON_PATH).toString('hex'))
    .send({});

    return res.text;
}

export async function sendAsset (tap_addrs: Array<string>): Promise<string> {
  const agent = new https.Agent({ rejectUnauthorized: false });

  const res = await superagent
    .post(`${TARO_SERVER_URL}/v1/taproot-assets/send`)
    .agent(agent)
    .type('application/json')
    .set('Grpc-Metadata-macaroon', fs.readFileSync(MACAROON_PATH).toString('hex'))
    .send({tap_addrs});

    return res.text;
}

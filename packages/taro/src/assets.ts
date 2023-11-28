// Copyright 2021-2022 @choko-wallet/taro authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as fs from 'fs';
import * as https from 'https';
import * as superagent from 'superagent';

import { MintRequest, TaroAssets, TaroConfig } from './types';

export async function getAssetsList (config: TaroConfig): Promise<string> {
  const agent = new https.Agent({ rejectUnauthorized: false });

  const res = await superagent
    .get(`${config.TARO_SERVER_URL}/v1/taproot-assets/assets`)
    .agent(agent)
    .type('application/json')
    .set('Grpc-Metadata-macaroon', fs.readFileSync(config.MACAROON_PATH).toString('hex'));

  return res.text;
}

export async function mintAsset (config: TaroConfig, asset: TaroAssets, enableEmission: boolean): Promise<string> {
  const agent = new https.Agent({ rejectUnauthorized: false });

  const res = await superagent
    .post(`${config.TARO_SERVER_URL}/v1/taproot-assets/assets`)
    .agent(agent)
    .type('application/json')
    .set('Grpc-Metadata-macaroon', fs.readFileSync(config.MACAROON_PATH).toString('hex'))
    .send({
      asset,
      enableEmission
    } as MintRequest);

  return res.text;
}

export async function finalizeMintAsset (config: TaroConfig): Promise<string> {
  const agent = new https.Agent({ rejectUnauthorized: false });

  const res = await superagent
    .post(`${config.TARO_SERVER_URL}/v1/taproot-assets/assets/mint/finalize`)
    .agent(agent)
    .type('application/json')
    .set('Grpc-Metadata-macaroon', fs.readFileSync(config.MACAROON_PATH).toString('hex'))
    .send({});

  return res.text;
}

export async function sendAsset (config: TaroConfig, tapAddrs: Array<string>): Promise<string> {
  const agent = new https.Agent({ rejectUnauthorized: false });

  const res = await superagent
    .post(`${config.TARO_SERVER_URL}/v1/taproot-assets/send`)
    .agent(agent)
    .type('application/json')
    .set('Grpc-Metadata-macaroon', fs.readFileSync(config.MACAROON_PATH).toString('hex'))
    .send({ tapAddrs });

  return res.text;
}

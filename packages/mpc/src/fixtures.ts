// Copyright 2021-2022 @choko-wallet/app-utils authors & contributors
// SPDX-License-Identifier: Apache-2.0

import superagent from 'superagent';

import { MpcNodeFixtures, PeerIds } from './types';

const fetchPeers = async (): Promise<MpcNodeFixtures> => {
  const res = await superagent
    // .get('https://auth.choko.app/info/peerid')
    .get('http://0.0.0.0:8080/info/peerid')
    .accept('json');
  const peerIds = JSON.parse(res.text) as PeerIds;

  return {
    f1: [
      peerIds.f1,
      `/ip4/127.0.0.1/tcp/2620/ws/p2p/${peerIds.f1}`
    ],
    f2: [
      peerIds.f2,
      `/ip4/127.0.0.1/tcp/2621/ws/p2p/${peerIds.f2}`
    ],
    l: [
      peerIds.l,
      `/ip4/127.0.0.1/tcp/2622/ws/p2p/${peerIds.l}`
    ]
  };
};

export { fetchPeers };

// Copyright 2021-2022 @choko-wallet/taro authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { finalizeMintAsset, getAssetsList, mintAsset } from '.';

const config = {
  MACAROON_PATH: '',
  TARO_SERVER_URL: ''
};

jest.mock('readline');

describe('Test Assets Funtions', function () {
  it('Test Assets List', async () => {
    const res: string = await getAssetsList(config);

    const data = JSON.parse(res) as { assets: string[] };

    if (typeof data === 'object' && data !== null) {
      expect(Object.prototype.hasOwnProperty.call(data, 'assets')).toEqual(true);
    }
  });

  it('Test to Mint Asset', async () => {
    const res: string = await mintAsset(config, {
      amount: 10,
      assetType: 'NORMAL',
      name: 'new-assets'
    }, false);

    const data = JSON.parse(res.replace('batch_key', 'batchKey')) as { batchKey: string };

    if (typeof data === 'object' && data !== null) {
      expect(Object.prototype.hasOwnProperty.call(data, 'batchKey')).toEqual(true);
    }
  });

  it('Test to Finalize Minting Asset', async () => {
    const res: string = await finalizeMintAsset(config);

    const data = JSON.parse(res.replace('batch_key', 'batchKey')) as { batchKey: string };

    if (typeof data === 'object' && data !== null) {
      expect(Object.prototype.hasOwnProperty.call(data, 'batchKey')).toEqual(true);
    }
  });
});

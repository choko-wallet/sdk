import { getAssetsList, mintAsset, finalizeMintAsset } from '.';

describe('Test Assets Funtions', function () {
  it('Test Assets List', async () => {
    const res = await getAssetsList();

    const data = JSON.parse(res)

    expect(data.hasOwnProperty('assets')).toEqual(true);
  });

  it('Test to Mint Asset', async () => {
    const res = await mintAsset({
      asset_type: 'NORMAL',
      name: 'new-assets',
      amount: 10,
    }, false);

    const data = JSON.parse(res)

    expect(data.hasOwnProperty('batch_key')).toEqual(true);
  });

  it('Test to Finalize Minting Asset', async () => {
    const res = await finalizeMintAsset();

    const data = JSON.parse(res)

    expect(data.hasOwnProperty('batch_key')).toEqual(true);
  });
})
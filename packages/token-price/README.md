# @choko-wallet/token-price

This is a pre-built lib contains tokeninfo 

Step 1: 

Fetch top marketcap tokens/coins
`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&locale=en`


Step 2:

Fetch Token Contract Info: 

`https://api.coingecko.com/api/v3/coins/${info.coingeckoId}`

Script: 

```javascript
import { tokenInfo } from './tokenInfo';
import superagent from 'superagent'
import fs from 'fs'
import { sleep } from '@skyekiwi/util'

const main = async() => {
  for (let i = 0; i < 250; i ++) {
    if ( fs.existsSync(`./res/${i}.json`) ) {
      continue;
    }

    const info = tokenInfo[i];
    const result = await superagent
    .get(`https://api.coingecko.com/api/v3/coins/${info.coingeckoId}`);

    const tokenData = JSON.parse(result.text);

    const ethereumAddress = tokenData.platforms['ethereum'];
    const bnbAddress = tokenData.platforms['binance-smart-chain'];
    const polygonAddress = tokenData.platforms['polygon-pos'];

    const r = {
    ...info,
    contractAddress: {
      1: ethereumAddress,
      56: bnbAddress,
      137: polygonAddress
    }
    }
    fs.writeFileSync(`./res/${i}.json`, JSON.stringify(r, null, 2));

    await sleep(5000)
  }
}

main()
```

The above script will products a a bunch of json files that contains each token/coin 

Step 3
Combine those JSON into a single file. 

```javascript
let res: TokenData = {};
for (let i = 0; i < 250; i ++) {
  const content = fs.readFileSync(`./res/${i}.json`);
  const info = JSON.parse(content.toString());

  res[info.coingeckoId] = info;
}

fs.writeFileSync(`./res/all.json`, JSON.stringify(res, null, 2));

```
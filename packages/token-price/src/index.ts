// Copyright 2021-2022 @choko-wallet/rpc authors & contributors
// SPDX-License-Identifier: Apache-2.0

import superagent from 'superagent';

export const fetchMarketCap = async () => {
  const result = await superagent.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&locale=en');

  console.log(result.body);
};

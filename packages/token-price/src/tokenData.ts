// Copyright 2021-2022 @choko-wallet/token-price authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TokenData } from './types';

/* eslint-disable sort-keys */

export const tokenData: TokenData = {
  bitcoin: {
    coingeckoId: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
    contractAddress: {}
  },
  ethereum: {
    coingeckoId: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    contractAddress: {}
  },
  tether: {
    coingeckoId: 'tether',
    symbol: 'usdt',
    name: 'Tether',
    image: 'https://assets.coingecko.com/coins/images/325/large/Tether.png?1668148663',
    contractAddress: {
      1: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      56: '0x55d398326f99059ff775485246999027b3197955',
      137: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f'
    }
  },
  binancecoin: {
    coingeckoId: 'binancecoin',
    symbol: 'bnb',
    name: 'BNB',
    image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1644979850',
    contractAddress: {
      1: '0xb8c77482e45f1f44de1745f52c74426c631bdd52'
    }
  },
  'usd-coin': {
    coingeckoId: 'usd-coin',
    symbol: 'usdc',
    name: 'USD Coin',
    image: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389',
    contractAddress: {
      1: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      56: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
      137: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'
    }
  },
  ripple: {
    coingeckoId: 'ripple',
    symbol: 'xrp',
    name: 'XRP',
    image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png?1605778731',
    contractAddress: {}
  },
  'staked-ether': {
    coingeckoId: 'staked-ether',
    symbol: 'steth',
    name: 'Lido Staked Ether',
    image: 'https://assets.coingecko.com/coins/images/13442/large/steth_logo.png?1608607546',
    contractAddress: {
      1: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84'
    }
  },
  cardano: {
    coingeckoId: 'cardano',
    symbol: 'ada',
    name: 'Cardano',
    image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png?1547034860',
    contractAddress: {}
  },
  dogecoin: {
    coingeckoId: 'dogecoin',
    symbol: 'doge',
    name: 'Dogecoin',
    image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png?1547792256',
    contractAddress: {}
  },
  tron: {
    coingeckoId: 'tron',
    symbol: 'trx',
    name: 'TRON',
    image: 'https://assets.coingecko.com/coins/images/1094/large/tron-logo.png?1547035066',
    contractAddress: {}
  },
  solana: {
    coingeckoId: 'solana',
    symbol: 'sol',
    name: 'Solana',
    image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png?1640133422',
    contractAddress: {}
  },
  'matic-network': {
    coingeckoId: 'matic-network',
    symbol: 'matic',
    name: 'Polygon',
    image: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png?1624446912',
    contractAddress: {
      1: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
      56: '0xcc42724c6683b7e57334c4e856f4c9965ed682bd',
      137: '0x0000000000000000000000000000000000001010'
    }
  },
  litecoin: {
    coingeckoId: 'litecoin',
    symbol: 'ltc',
    name: 'Litecoin',
    image: 'https://assets.coingecko.com/coins/images/2/large/litecoin.png?1547033580',
    contractAddress: {}
  },
  polkadot: {
    coingeckoId: 'polkadot',
    symbol: 'dot',
    name: 'Polkadot',
    image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png?1639712644',
    contractAddress: {}
  },
  'binance-usd': {
    coingeckoId: 'binance-usd',
    symbol: 'busd',
    name: 'Binance USD',
    image: 'https://assets.coingecko.com/coins/images/9576/large/BUSD.png?1568947766',
    contractAddress: {
      1: '0x4fabb145d64652a948d72533023f6e7a623c7c53',
      56: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      137: '0xdab529f40e671a1d4bf91361c21bf9f0c9712ab7'
    }
  },
  dai: {
    coingeckoId: 'dai',
    symbol: 'dai',
    name: 'Dai',
    image: 'https://assets.coingecko.com/coins/images/9956/large/4943.png?1636636734',
    contractAddress: {
      1: '0x6b175474e89094c44da98b954eedeac495271d0f',
      56: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
      137: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'
    }
  },
  'wrapped-bitcoin': {
    coingeckoId: 'wrapped-bitcoin',
    symbol: 'wbtc',
    name: 'Wrapped Bitcoin',
    image: 'https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png?1548822744',
    contractAddress: {
      1: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      137: '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6'
    }
  },
  'avalanche-2': {
    coingeckoId: 'avalanche-2',
    symbol: 'avax',
    name: 'Avalanche',
    image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png?1670992574',
    contractAddress: {}
  },
  'shiba-inu': {
    coingeckoId: 'shiba-inu',
    symbol: 'shib',
    name: 'Shiba Inu',
    image: 'https://assets.coingecko.com/coins/images/11939/large/shiba.png?1622619446',
    contractAddress: {
      1: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce'
    }
  },
  'leo-token': {
    coingeckoId: 'leo-token',
    symbol: 'leo',
    name: 'LEO Token',
    image: 'https://assets.coingecko.com/coins/images/8418/large/leo-token.png?1558326215',
    contractAddress: {
      1: '0x2af5d2ad76741191d15dfe7bf6ac92d4bd912ca3'
    }
  },
  uniswap: {
    coingeckoId: 'uniswap',
    symbol: 'uni',
    name: 'Uniswap',
    image: 'https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png?1600306604',
    contractAddress: {
      1: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
      56: '0xbf5140a22578168fd562dccf235e5d43a02ce9b1',
      137: '0xb33eaad8d922b1083446dc23f610c2567fb5180f'
    }
  },
  chainlink: {
    coingeckoId: 'chainlink',
    symbol: 'link',
    name: 'Chainlink',
    image: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png?1547034700',
    contractAddress: {
      1: '0x514910771af9ca656af840dff83e8264ecf986ca',
      5: '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
      56: '0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd',
      137: '0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39',
      80001: '0x326C977E6efc84E512bB9C30f76E30c160eD06FB'
    }
  },
  monero: {
    coingeckoId: 'monero',
    symbol: 'xmr',
    name: 'Monero',
    image: 'https://assets.coingecko.com/coins/images/69/large/monero_logo.png?1547033729',
    contractAddress: {}
  },
  cosmos: {
    coingeckoId: 'cosmos',
    symbol: 'atom',
    name: 'Cosmos Hub',
    image: 'https://assets.coingecko.com/coins/images/1481/large/cosmos_hub.png?1555657960',
    contractAddress: {
      56: '0x0eb3a705fc54725037cc9e008bdede697f62f335'
    }
  },
  okb: {
    coingeckoId: 'okb',
    symbol: 'okb',
    name: 'OKB',
    image: 'https://assets.coingecko.com/coins/images/4463/large/WeChat_Image_20220118095654.png?1642471050',
    contractAddress: {
      1: '0x75231f58b43240c9718dd58b4967c5114342a86c'
    }
  },
  stellar: {
    coingeckoId: 'stellar',
    symbol: 'xlm',
    name: 'Stellar',
    image: 'https://assets.coingecko.com/coins/images/100/large/Stellar_symbol_black_RGB.png?1552356157',
    contractAddress: {}
  },
  'the-open-network': {
    coingeckoId: 'the-open-network',
    symbol: 'ton',
    name: 'Toncoin',
    image: 'https://assets.coingecko.com/coins/images/17980/large/ton_symbol.png?1670498136',
    contractAddress: {
      1: '0x582d872a1b094fc48f5de31d3b73f2d9be47def1',
      56: '0x76a797a59ba2c17726896976b7b3747bfd1d220f'
    }
  },
  'ethereum-classic': {
    coingeckoId: 'ethereum-classic',
    symbol: 'etc',
    name: 'Ethereum Classic',
    image: 'https://assets.coingecko.com/coins/images/453/large/ethereum-classic-logo.png?1547034169',
    contractAddress: {}
  },
  'true-usd': {
    coingeckoId: 'true-usd',
    symbol: 'tusd',
    name: 'TrueUSD',
    image: 'https://assets.coingecko.com/coins/images/3449/large/tusd.png?1618395665',
    contractAddress: {
      1: '0x0000000000085d4780b73119b644ae5ecd22b376',
      56: '0x14016e85a25aeb13065688cafb43044c2ef86784',
      137: '0x2e1ad108ff1d8c782fcbbb89aad783ac49586756'
    }
  },
  'bitcoin-cash': {
    coingeckoId: 'bitcoin-cash',
    symbol: 'bch',
    name: 'Bitcoin Cash',
    image: 'https://assets.coingecko.com/coins/images/780/large/bitcoin-cash-circle.png?1594689492',
    contractAddress: {}
  },
  'lido-dao': {
    coingeckoId: 'lido-dao',
    symbol: 'ldo',
    name: 'Lido DAO',
    image: 'https://assets.coingecko.com/coins/images/13573/large/Lido_DAO.png?1609873644',
    contractAddress: {
      1: '0x5a98fcbea516cf06857215779fd812ca3bef1b32',
      137: '0xc3c7d422809852031b44ab29eec9f1eff2a58756'
    }
  },
  'internet-computer': {
    coingeckoId: 'internet-computer',
    symbol: 'icp',
    name: 'Internet Computer',
    image: 'https://assets.coingecko.com/coins/images/14495/large/Internet_Computer_logo.png?1620703073',
    contractAddress: {}
  },
  'quant-network': {
    coingeckoId: 'quant-network',
    symbol: 'qnt',
    name: 'Quant',
    image: 'https://assets.coingecko.com/coins/images/3370/large/5ZOu7brX_400x400.jpg?1612437252',
    contractAddress: {
      1: '0x4a220e6096b25eadb88358cb44068a3248254675'
    }
  },
  filecoin: {
    coingeckoId: 'filecoin',
    symbol: 'fil',
    name: 'Filecoin',
    image: 'https://assets.coingecko.com/coins/images/12817/large/filecoin.png?1602753933',
    contractAddress: {}
  },
  'crypto-com-chain': {
    coingeckoId: 'crypto-com-chain',
    symbol: 'cro',
    name: 'Cronos',
    image: 'https://assets.coingecko.com/coins/images/7310/large/cro_token_logo.png?1669699773',
    contractAddress: {
      1: '0xa0b73e1ff0b80914ab6fe0444e65848c4c34450b'
    }
  },
  'hedera-hashgraph': {
    coingeckoId: 'hedera-hashgraph',
    symbol: 'hbar',
    name: 'Hedera',
    image: 'https://assets.coingecko.com/coins/images/3688/large/hbar.png?1637045634',
    contractAddress: {}
  },
  aptos: {
    coingeckoId: 'aptos',
    symbol: 'apt',
    name: 'Aptos',
    image: 'https://assets.coingecko.com/coins/images/26455/large/aptos_round.png?1666839629',
    contractAddress: {}
  },
  arbitrum: {
    coingeckoId: 'arbitrum',
    symbol: 'arb',
    name: 'Arbitrum',
    image: 'https://assets.coingecko.com/coins/images/16547/large/photo_2023-03-29_21.47.00.jpeg?1680097630',
    contractAddress: {
      1: '0xb50721bcf8d664c30412cfbc6cf7a15145234ad1'
    }
  },
  vechain: {
    coingeckoId: 'vechain',
    symbol: 'vet',
    name: 'VeChain',
    image: 'https://assets.coingecko.com/coins/images/1167/large/VET_Token_Icon.png?1680067517',
    contractAddress: {}
  },
  near: {
    coingeckoId: 'near',
    symbol: 'near',
    name: 'NEAR Protocol',
    image: 'https://assets.coingecko.com/coins/images/10365/large/near.jpg?1683515160',
    contractAddress: {}
  },
  'paxos-standard': {
    coingeckoId: 'paxos-standard',
    symbol: 'usdp',
    name: 'Pax Dollar',
    image: 'https://assets.coingecko.com/coins/images/6013/large/Pax_Dollar.png?1629877204',
    contractAddress: {
      1: '0x8e870d67f660d95d5be530380d0ec0bd388289e1'
    }
  },
  frax: {
    coingeckoId: 'frax',
    symbol: 'frax',
    name: 'Frax',
    image: 'https://assets.coingecko.com/coins/images/13422/large/FRAX_icon.png?1679886922',
    contractAddress: {
      1: '0x853d955acef822db058eb8505911ed77f175b99e',
      56: '0x90c97f71e18723b0cf0dfa30ee176ab653e89f40',
      137: '0x45c32fa6df82ead1e2ef74d17b76547eddfaff89'
    }
  },
  bscex: {
    coingeckoId: 'bscex',
    symbol: 'bscx',
    name: 'BSCEX',
    image: 'https://assets.coingecko.com/coins/images/13582/large/icon-bscex-200x200.png?1609917200',
    contractAddress: {
      56: '0x5ac52ee5b2a633895292ff6d8a89bb9190451587'
    }
  },
  'the-graph': {
    coingeckoId: 'the-graph',
    symbol: 'grt',
    name: 'The Graph',
    image: 'https://assets.coingecko.com/coins/images/13397/large/Graph_Token.png?1608145566',
    contractAddress: {
      1: '0xc944e90c64b2c07662a292be6244bdf05cda44a7',
      137: '0x5fe2b58c013d7601147dcdd68c143a77499f5531'
    }
  },
  'rocket-pool': {
    coingeckoId: 'rocket-pool',
    symbol: 'rpl',
    name: 'Rocket Pool',
    image: 'https://assets.coingecko.com/coins/images/2090/large/rocket_pool_%28RPL%29.png?1637662441',
    contractAddress: {
      1: '0xd33526068d116ce69f19a9ee46f0bd304f21a51f',
      137: '0x7205705771547cf79201111b4bd8aaf29467b9ec'
    }
  },
  apecoin: {
    coingeckoId: 'apecoin',
    symbol: 'ape',
    name: 'ApeCoin',
    image: 'https://assets.coingecko.com/coins/images/24383/large/apecoin.jpg?1647476455',
    contractAddress: {
      1: '0x4d224452801aced8b2f0aebe155379bb5d594381',
      137: '0xb7b31a6bc18e48888545ce79e83e06003be70930'
    }
  },
  'rocket-pool-eth': {
    coingeckoId: 'rocket-pool-eth',
    symbol: 'reth',
    name: 'Rocket Pool ETH',
    image: 'https://assets.coingecko.com/coins/images/20764/large/reth.png?1637652366',
    contractAddress: {
      1: '0xae78736cd615f374d3085123a210448e74fc6393',
      137: '0x0266f4f08d82372cf0fcbccc0ff74309089c74d1'
    }
  },
  algorand: {
    coingeckoId: 'algorand',
    symbol: 'algo',
    name: 'Algorand',
    image: 'https://assets.coingecko.com/coins/images/4380/large/download.png?1547039725',
    contractAddress: {}
  },
  'elrond-erd-2': {
    coingeckoId: 'elrond-erd-2',
    symbol: 'egld',
    name: 'MultiversX',
    image: 'https://assets.coingecko.com/coins/images/12335/large/egld-token-logo.png?1673490885',
    contractAddress: {}
  },
  usdd: {
    coingeckoId: 'usdd',
    symbol: 'usdd',
    name: 'USDD',
    image: 'https://assets.coingecko.com/coins/images/25380/large/UUSD.jpg?1651823371',
    contractAddress: {
      1: '0x0c10bf8fcb7bf5412187a595ab97a3609160b5c6',
      56: '0xd17479997f34dd9156deef8f95a52d81d265be9c'
    }
  },
  aave: {
    coingeckoId: 'aave',
    symbol: 'aave',
    name: 'Aave',
    image: 'https://assets.coingecko.com/coins/images/12645/large/AAVE.png?1601374110',
    contractAddress: {
      1: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
      56: '0xfb6115445bff7b52feb98650c87f44907e58f802',
      137: '0xd6df932a45c0f255f85145f286ea0b292b21c90b'
    }
  },
  eos: {
    coingeckoId: 'eos',
    symbol: 'eos',
    name: 'EOS',
    image: 'https://assets.coingecko.com/coins/images/738/large/eos-eos-logo.png?1547034481',
    contractAddress: {}
  },
  blockstack: {
    coingeckoId: 'blockstack',
    symbol: 'stx',
    name: 'Stacks',
    image: 'https://assets.coingecko.com/coins/images/2069/large/Stacks_logo_full.png?1604112510',
    contractAddress: {}
  },
  'the-sandbox': {
    coingeckoId: 'the-sandbox',
    symbol: 'sand',
    name: 'The Sandbox',
    image: 'https://assets.coingecko.com/coins/images/12129/large/sandbox_logo.jpg?1597397942',
    contractAddress: {
      1: '0x3845badade8e6dff049820680d1f14bd3903a5d0',
      137: '0xbbba073c31bf03b8acf7c28ef0738decf3695683'
    }
  },
  'render-token': {
    coingeckoId: 'render-token',
    symbol: 'rndr',
    name: 'Render',
    image: 'https://assets.coingecko.com/coins/images/11636/large/rndr.png?1638840934',
    contractAddress: {
      1: '0x6de037ef9ad2725eb40118bb1702ebb27e4aeb24',
      137: '0x61299774020da444af134c82fa83e3810b309991'
    }
  },
  optimism: {
    coingeckoId: 'optimism',
    symbol: 'op',
    name: 'Optimism',
    image: 'https://assets.coingecko.com/coins/images/25244/large/Optimism.png?1660904599',
    contractAddress: {}
  },
  whitebit: {
    coingeckoId: 'whitebit',
    symbol: 'wbt',
    name: 'WhiteBIT Token',
    image: 'https://assets.coingecko.com/coins/images/27045/large/wbt_token.png?1667923752',
    contractAddress: {
      1: '0x925206b8a707096ed26ae47c84747fe0bb734f59'
    }
  },
  tezos: {
    coingeckoId: 'tezos',
    symbol: 'xtz',
    name: 'Tezos',
    image: 'https://assets.coingecko.com/coins/images/976/large/Tezos-logo.png?1547034862',
    contractAddress: {}
  },
  'bitget-token': {
    coingeckoId: 'bitget-token',
    symbol: 'bgb',
    name: 'Bitget Token',
    image: 'https://assets.coingecko.com/coins/images/11610/large/photo_2022-01-24_14-08-03.jpg?1643019457',
    contractAddress: {
      1: '0x19de6b897ed14a376dda0fe53a5420d2ac828a28'
    }
  },
  fantom: {
    coingeckoId: 'fantom',
    symbol: 'ftm',
    name: 'Fantom',
    image: 'https://assets.coingecko.com/coins/images/4001/large/Fantom_round.png?1669652346',
    contractAddress: {}
  },
  'theta-token': {
    coingeckoId: 'theta-token',
    symbol: 'theta',
    name: 'Theta Network',
    image: 'https://assets.coingecko.com/coins/images/2538/large/theta-token-logo.png?1548387191',
    contractAddress: {}
  },
  radix: {
    coingeckoId: 'radix',
    symbol: 'xrd',
    name: 'Radix',
    image: 'https://assets.coingecko.com/coins/images/4374/large/Radix.png?1629701658',
    contractAddress: {}
  },
  bitdao: {
    coingeckoId: 'bitdao',
    symbol: 'bit',
    name: 'BitDAO',
    image: 'https://assets.coingecko.com/coins/images/17627/large/rI_YptK8.png?1653983088',
    contractAddress: {
      1: '0x1a4b46696b2bb4794eb3d4c26f1c55f9170fa4c5'
    }
  },
  decentraland: {
    coingeckoId: 'decentraland',
    symbol: 'mana',
    name: 'Decentraland',
    image: 'https://assets.coingecko.com/coins/images/878/large/decentraland-mana.png?1550108745',
    contractAddress: {
      1: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
      137: '0xa1c57f48f0deb89f569dfbe6e2b7f46d33606fd4'
    }
  },
  'immutable-x': {
    coingeckoId: 'immutable-x',
    symbol: 'imx',
    name: 'ImmutableX',
    image: 'https://assets.coingecko.com/coins/images/17233/large/immutableX-symbol-BLK-RGB.png?1665110648',
    contractAddress: {
      1: '0xf57e7e7c23978c3caec3c3548e3d615c346e79ff'
    }
  },
  'gemini-dollar': {
    coingeckoId: 'gemini-dollar',
    symbol: 'gusd',
    name: 'Gemini Dollar',
    image: 'https://assets.coingecko.com/coins/images/5992/large/gemini-dollar-gusd.png?1536745278',
    contractAddress: {
      1: '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd'
    }
  },
  'kucoin-shares': {
    coingeckoId: 'kucoin-shares',
    symbol: 'kcs',
    name: 'KuCoin',
    image: 'https://assets.coingecko.com/coins/images/1047/large/sa9z79.png?1610678720',
    contractAddress: {}
  },
  'gatechain-token': {
    coingeckoId: 'gatechain-token',
    symbol: 'gt',
    name: 'Gate',
    image: 'https://assets.coingecko.com/coins/images/8183/large/gt.png?1556085624',
    contractAddress: {
      1: '0xe66747a101bff2dba3697199dcce5b743b454759'
    }
  },
  'curve-dao-token': {
    coingeckoId: 'curve-dao-token',
    symbol: 'crv',
    name: 'Curve DAO',
    image: 'https://assets.coingecko.com/coins/images/12124/large/Curve.png?1597369484',
    contractAddress: {
      1: '0xd533a949740bb3306d119cc777fa900ba034cd52',
      137: '0x172370d5cd63279efa6d502dab29171933a610af'
    }
  },
  'axie-infinity': {
    coingeckoId: 'axie-infinity',
    symbol: 'axs',
    name: 'Axie Infinity',
    image: 'https://assets.coingecko.com/coins/images/13029/large/axie_infinity_logo.png?1604471082',
    contractAddress: {
      1: '0xbb0e17ef65f82ab018d8edd776e8dd940327b28b',
      56: '0x715d400f88c167884bbcc41c5fea407ed4d2f8a0'
    }
  },
  havven: {
    coingeckoId: 'havven',
    symbol: 'snx',
    name: 'Synthetix Network',
    image: 'https://assets.coingecko.com/coins/images/3406/large/SNX.png?1598631139',
    contractAddress: {
      1: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
      137: '0x50b728d8d964fd00c2d0aad81718b71311fef68a'
    }
  },
  maker: {
    coingeckoId: 'maker',
    symbol: 'mkr',
    name: 'Maker',
    image: 'https://assets.coingecko.com/coins/images/1364/large/Mark_Maker.png?1585191826',
    contractAddress: {
      1: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
      137: '0x6f7c932e7684666c9fd1d44527765433e01ff61d'
    }
  },
  neo: {
    coingeckoId: 'neo',
    symbol: 'neo',
    name: 'NEO',
    image: 'https://assets.coingecko.com/coins/images/480/large/NEO_512_512.png?1594357361',
    contractAddress: {}
  },
  gala: {
    coingeckoId: 'gala',
    symbol: 'gala',
    name: 'GALA',
    image: 'https://assets.coingecko.com/coins/images/12493/large/GALA-COINGECKO.png?1600233435',
    contractAddress: {
      1: '0xd1d2eb1b1e90b638588728b4130137d262c87cae'
    }
  },
  bittorrent: {
    coingeckoId: 'bittorrent',
    symbol: 'btt',
    name: 'BitTorrent',
    image: 'https://assets.coingecko.com/coins/images/22457/large/btt_logo.png?1643857231',
    contractAddress: {
      1: '0xc669928185dbce49d2230cc9b0979be6dc797957'
    }
  },
  flow: {
    coingeckoId: 'flow',
    symbol: 'flow',
    name: 'Flow',
    image: 'https://assets.coingecko.com/coins/images/13446/large/5f6294c0c7a8cda55cb1c936_Flow_Wordmark.png?1631696776',
    contractAddress: {}
  },
  'terra-luna': {
    coingeckoId: 'terra-luna',
    symbol: 'lunc',
    name: 'Terra Luna Classic',
    image: 'https://assets.coingecko.com/coins/images/8284/large/01_LunaClassic_color.png?1653547790',
    contractAddress: {}
  },
  'pax-gold': {
    coingeckoId: 'pax-gold',
    symbol: 'paxg',
    name: 'PAX Gold',
    image: 'https://assets.coingecko.com/coins/images/9519/large/paxg.PNG?1568542565',
    contractAddress: {
      1: '0x45804880de22913dafe09f4980848ece6ecbaf78'
    }
  },
  'bitcoin-cash-sv': {
    coingeckoId: 'bitcoin-cash-sv',
    symbol: 'bsv',
    name: 'Bitcoin SV',
    image: 'https://assets.coingecko.com/coins/images/6799/large/BSV.png?1558947902',
    contractAddress: {}
  },
  'tether-gold': {
    coingeckoId: 'tether-gold',
    symbol: 'xaut',
    name: 'Tether Gold',
    image: 'https://assets.coingecko.com/coins/images/10481/large/Tether_Gold.png?1668148656',
    contractAddress: {
      1: '0x68749665ff8d2d112fa859aa293f07a622782f38'
    }
  },
  'xdce-crowd-sale': {
    coingeckoId: 'xdce-crowd-sale',
    symbol: 'xdc',
    name: 'XDC Network',
    image: 'https://assets.coingecko.com/coins/images/2912/large/xdc-icon.png?1633700890',
    contractAddress: {}
  },
  'klay-token': {
    coingeckoId: 'klay-token',
    symbol: 'klay',
    name: 'Klaytn',
    image: 'https://assets.coingecko.com/coins/images/9672/large/klaytn.png?1660288824',
    contractAddress: {}
  },
  'compound-ether': {
    coingeckoId: 'compound-ether',
    symbol: 'ceth',
    name: 'cETH',
    image: 'https://assets.coingecko.com/coins/images/10643/large/ceth2.JPG?1581389598',
    contractAddress: {
      1: '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5'
    }
  },
  'casper-network': {
    coingeckoId: 'casper-network',
    symbol: 'cspr',
    name: 'Casper Network',
    image: 'https://assets.coingecko.com/coins/images/15279/large/casper.PNG?1620341020',
    contractAddress: {}
  },
  'tokenize-xchange': {
    coingeckoId: 'tokenize-xchange',
    symbol: 'tkx',
    name: 'Tokenize Xchange',
    image: 'https://assets.coingecko.com/coins/images/4984/large/TKX_-_Logo_-_RGB-15.png?1672912391',
    contractAddress: {
      1: '0x667102bd3413bfeaa3dffb48fa8288819e480a88'
    }
  },
  kava: {
    coingeckoId: 'kava',
    symbol: 'kava',
    name: 'Kava',
    image: 'https://assets.coingecko.com/coins/images/9761/large/kava.png?1663638871',
    contractAddress: {}
  },
  'injective-protocol': {
    coingeckoId: 'injective-protocol',
    symbol: 'inj',
    name: 'Injective',
    image: 'https://assets.coingecko.com/coins/images/12882/large/Secondary_Symbol.png?1628233237',
    contractAddress: {
      1: '0xe28b3b32b6c345a34ff64674606124dd5aceca30',
      56: '0xa2b726b1145a4773f68593cf171187d8ebe4d495'
    }
  },
  iota: {
    coingeckoId: 'iota',
    symbol: 'miota',
    name: 'IOTA',
    image: 'https://assets.coingecko.com/coins/images/692/large/IOTA_Swirl.png?1604238557',
    contractAddress: {}
  },
  'huobi-token': {
    coingeckoId: 'huobi-token',
    symbol: 'ht',
    name: 'Huobi',
    image: 'https://assets.coingecko.com/coins/images/2822/large/huobi-token-logo.png?1547036992',
    contractAddress: {
      1: '0x6f259637dcd74c767781e37bc6133cd6a68aa161'
    }
  },
  'compound-usd-coin': {
    coingeckoId: 'compound-usd-coin',
    symbol: 'cusdc',
    name: 'cUSDC',
    image: 'https://assets.coingecko.com/coins/images/9442/large/Compound_USDC.png?1567581577',
    contractAddress: {
      1: '0x39aa39c021dfbae8fac545936693ac917d5e7563'
    }
  },
  ecash: {
    coingeckoId: 'ecash',
    symbol: 'xec',
    name: 'eCash',
    image: 'https://assets.coingecko.com/coins/images/16646/large/Logo_final-22.png?1628239446',
    contractAddress: {}
  },
  'frax-ether': {
    coingeckoId: 'frax-ether',
    symbol: 'frxeth',
    name: 'Frax Ether',
    image: 'https://assets.coingecko.com/coins/images/28284/large/frxETH_icon.png?1679886981',
    contractAddress: {
      1: '0x5e8422345238f34275888049021821e8e08caa1f',
      56: '0x64048a7eecf3a2f1ba9e144aac3d7db6e58f555e',
      137: '0xee327f889d5947c1dc1934bb208a1e792f953e96'
    }
  },
  'mina-protocol': {
    coingeckoId: 'mina-protocol',
    symbol: 'mina',
    name: 'Mina Protocol',
    image: 'https://assets.coingecko.com/coins/images/15628/large/JM4_vQ34_400x400.png?1621394004',
    contractAddress: {}
  },
  gmx: {
    coingeckoId: 'gmx',
    symbol: 'gmx',
    name: 'GMX',
    image: 'https://assets.coingecko.com/coins/images/18323/large/arbit.png?1631532468',
    contractAddress: {}
  },
  'conflux-token': {
    coingeckoId: 'conflux-token',
    symbol: 'cfx',
    name: 'Conflux',
    image: 'https://assets.coingecko.com/coins/images/13079/large/3vuYMbjN.png?1631512305',
    contractAddress: {}
  },
  pepe: {
    coingeckoId: 'pepe',
    symbol: 'pepe',
    name: 'Pepe',
    image: 'https://assets.coingecko.com/coins/images/29850/large/pepe-token.jpeg?1682922725',
    contractAddress: {
      1: '0x6982508145454ce325ddbe47a25d4ec3d2311933',
      56: '0x25d887ce7a35172c62febfd67a1856f20faebb00'
    }
  },
  chiliz: {
    coingeckoId: 'chiliz',
    symbol: 'chz',
    name: 'Chiliz',
    image: 'https://assets.coingecko.com/coins/images/8834/large/CHZ_Token_updated.png?1675848257',
    contractAddress: {
      1: '0x3506424f91fd33084466f402d5d97f05f8e3b4af'
    }
  },
  'frax-share': {
    coingeckoId: 'frax-share',
    symbol: 'fxs',
    name: 'Frax Share',
    image: 'https://assets.coingecko.com/coins/images/13423/large/Frax_Shares_icon.png?1679886947',
    contractAddress: {
      1: '0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0',
      56: '0xe48a3d7d0bc88d552f730b62c006bc925eadb9ee',
      137: '0x1a3acf6d19267e2d3e7f898f42803e90c9219062'
    }
  },
  nexo: {
    coingeckoId: 'nexo',
    symbol: 'nexo',
    name: 'NEXO',
    image: 'https://assets.coingecko.com/coins/images/3695/large/nexo.png?1548086057',
    contractAddress: {
      1: '0xb62132e35a6c13ee1ee0f84dc5d40bad8d815206'
    }
  },
  nxm: {
    coingeckoId: 'nxm',
    symbol: 'nxm',
    name: 'Nexus Mutual',
    image: 'https://assets.coingecko.com/coins/images/11810/large/NXMmain.png?1674799570',
    contractAddress: {
      1: '0xd7c49cee7e9188cca6ad8ff264c1da2e69d4cf3b'
    }
  },
  tominet: {
    coingeckoId: 'tominet',
    symbol: 'tomi',
    name: 'tomiNet',
    image: 'https://assets.coingecko.com/coins/images/28730/large/logo_for_token.png?1673690005',
    contractAddress: {
      1: '0x4385328cc4d643ca98dfea734360c0f596c83449'
    }
  },
  dash: {
    coingeckoId: 'dash',
    symbol: 'dash',
    name: 'Dash',
    image: 'https://assets.coingecko.com/coins/images/19/large/dash-logo.png?1548385930',
    contractAddress: {}
  },
  sui: {
    coingeckoId: 'sui',
    symbol: 'sui',
    name: 'Sui',
    image: 'https://assets.coingecko.com/coins/images/26375/large/sui_asset.jpeg?1683114182',
    contractAddress: {}
  },
  'trust-wallet-token': {
    coingeckoId: 'trust-wallet-token',
    symbol: 'twt',
    name: 'Trust Wallet',
    image: 'https://assets.coingecko.com/coins/images/11085/large/Trust.png?1588062702',
    contractAddress: {
      56: '0x4b0f1812e5df2a09796481ff14017e6005508003'
    }
  },
  'mask-network': {
    coingeckoId: 'mask-network',
    symbol: 'mask',
    name: 'Mask Network',
    image: 'https://assets.coingecko.com/coins/images/14051/large/Mask_Network.jpg?1614050316',
    contractAddress: {
      1: '0x69af81e73a73b40adf4f3d4223cd9b1ece623074',
      56: '0x2ed9a5c8c13b93955103b9a7c167b67ef4d568a3',
      137: '0x2b9e7ccdf0f4e5b24757c1e1a80e311e34cb10c7'
    }
  },
  'woo-network': {
    coingeckoId: 'woo-network',
    symbol: 'woo',
    name: 'WOO Network',
    image: 'https://assets.coingecko.com/coins/images/12921/large/w2UiemF__400x400.jpg?1603670367',
    contractAddress: {
      1: '0x4691937a7508860f876c9c0a2a617e7d9e945d4b',
      56: '0x4691937a7508860f876c9c0a2a617e7d9e945d4b',
      137: '0x1b815d120b3ef02039ee11dc2d33de7aa4a8c603'
    }
  },
  'pancakeswap-token': {
    coingeckoId: 'pancakeswap-token',
    symbol: 'cake',
    name: 'PancakeSwap',
    image: 'https://assets.coingecko.com/coins/images/12632/large/pancakeswap-cake-logo_%281%29.png?1629359065',
    contractAddress: {
      1: '0x152649ea73beab28c5b49b26eb48f7ead6d4c898',
      56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82'
    }
  },
  zilliqa: {
    coingeckoId: 'zilliqa',
    symbol: 'zil',
    name: 'Zilliqa',
    image: 'https://assets.coingecko.com/coins/images/2687/large/Zilliqa-logo.png?1547036894',
    contractAddress: {
      56: '0xb86abcb37c3a4b64f74f59301aff131a1becc787'
    }
  },
  'liquity-usd': {
    coingeckoId: 'liquity-usd',
    symbol: 'lusd',
    name: 'Liquity USD',
    image: 'https://assets.coingecko.com/coins/images/14666/large/Group_3.png?1617631327',
    contractAddress: {
      1: '0x5f98805a4e8be255a32880fdec7f6728c6568ba0',
      137: '0x23001f892c0c82b79303edc9b9033cd190bb21c7'
    }
  },
  gnosis: {
    coingeckoId: 'gnosis',
    symbol: 'gno',
    name: 'Gnosis',
    image: 'https://assets.coingecko.com/coins/images/662/large/logo_square_simple_300px.png?1609402668',
    contractAddress: {
      1: '0x6810e776880c02933d47db1b9fc05908e5386b96'
    }
  },
  safemoon: {
    coingeckoId: 'safemoon',
    symbol: 'safemoon',
    name: 'SafeMoon [OLD]',
    image: 'https://assets.coingecko.com/coins/images/14362/large/174x174-white.png?1617174846',
    contractAddress: {
      56: '0x8076c74c5e3f5852037f31ff0093eeb8c8add8d3'
    }
  },
  osmosis: {
    coingeckoId: 'osmosis',
    symbol: 'osmo',
    name: 'Osmosis',
    image: 'https://assets.coingecko.com/coins/images/16724/large/osmo.png?1632763885',
    contractAddress: {}
  },
  kaspa: {
    coingeckoId: 'kaspa',
    symbol: 'kas',
    name: 'Kaspa',
    image: 'https://assets.coingecko.com/coins/images/25751/large/kaspa-icon-exchanges.png?1653891958',
    contractAddress: {}
  },
  'flare-networks': {
    coingeckoId: 'flare-networks',
    symbol: 'flr',
    name: 'Flare',
    image: 'https://assets.coingecko.com/coins/images/28624/large/FLR-icon200x200.png?1673325704',
    contractAddress: {}
  },
  cdai: {
    coingeckoId: 'cdai',
    symbol: 'cdai',
    name: 'cDAI',
    image: 'https://assets.coingecko.com/coins/images/9281/large/cDAI.png?1576467585',
    contractAddress: {
      1: '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643'
    }
  },
  cyberharbor: {
    coingeckoId: 'cyberharbor',
    symbol: 'cht',
    name: 'CyberHarbor',
    image: 'https://assets.coingecko.com/coins/images/29509/large/logo_4x.png?1682393133',
    contractAddress: {
      56: '0x67d8e0080b612afae75a7f7229bfed3cdb998462'
    }
  },
  'convex-finance': {
    coingeckoId: 'convex-finance',
    symbol: 'cvx',
    name: 'Convex Finance',
    image: 'https://assets.coingecko.com/coins/images/15585/large/convex.png?1621256328',
    contractAddress: {
      1: '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b'
    }
  },
  'mx-token': {
    coingeckoId: 'mx-token',
    symbol: 'mx',
    name: 'MX',
    image: 'https://assets.coingecko.com/coins/images/8545/large/MEXC_GLOBAL_LOGO.jpeg?1670213280',
    contractAddress: {
      1: '0x11eef04c884e24d9b7b4760e7476d06ddf797f36'
    }
  },
  thorchain: {
    coingeckoId: 'thorchain',
    symbol: 'rune',
    name: 'THORChain',
    image: 'https://assets.coingecko.com/coins/images/6595/large/Rune200x200.png?1671179394',
    contractAddress: {}
  },
  'oec-token': {
    coingeckoId: 'oec-token',
    symbol: 'okt',
    name: 'OKT Chain',
    image: 'https://assets.coingecko.com/coins/images/13708/large/WeChat_Image_20220118095654.png?1642471094',
    contractAddress: {}
  },
  loopring: {
    coingeckoId: 'loopring',
    symbol: 'lrc',
    name: 'Loopring',
    image: 'https://assets.coingecko.com/coins/images/913/large/LRC.png?1572852344',
    contractAddress: {
      1: '0xbbbbca6a901c926f240b89eacb641d8aec7aeafd'
    }
  },
  'staked-frax-ether': {
    coingeckoId: 'staked-frax-ether',
    symbol: 'sfrxeth',
    name: 'Staked Frax Ether',
    image: 'https://assets.coingecko.com/coins/images/28285/large/sfrxETH_icon.png?1679886768',
    contractAddress: {
      1: '0xac3e018457b222d93114458476f3e3416abbe38f',
      56: '0x3cd55356433c89e50dc51ab07ee0fa0a95623d53',
      137: '0x6d1fdbb266fcc09a16a22016369210a15bb95761'
    }
  },
  '1inch': {
    coingeckoId: '1inch',
    symbol: '1inch',
    name: '1inch',
    image: 'https://assets.coingecko.com/coins/images/13469/large/1inch-token.png?1608803028',
    contractAddress: {
      1: '0x111111111117dc0aa78b770fa6a738034120c302',
      56: '0x111111111117dc0aa78b770fa6a738034120c302',
      137: '0x9c2c5fd7b07e95ee044ddeba0e97a665f142394f'
    }
  },
  'basic-attention-token': {
    coingeckoId: 'basic-attention-token',
    symbol: 'bat',
    name: 'Basic Attention',
    image: 'https://assets.coingecko.com/coins/images/677/large/basic-attention-token.png?1547034427',
    contractAddress: {
      1: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
      137: '0x3cef98bb43d732e2f285ee605a8158cde967d219'
    }
  },
  beldex: {
    coingeckoId: 'beldex',
    symbol: 'bdx',
    name: 'Beldex',
    image: 'https://assets.coingecko.com/coins/images/5111/large/Beldex.png?1559189036',
    contractAddress: {}
  },
  enjincoin: {
    coingeckoId: 'enjincoin',
    symbol: 'enj',
    name: 'Enjin Coin',
    image: 'https://assets.coingecko.com/coins/images/1102/large/enjin-coin-logo.png?1547035078',
    contractAddress: {
      1: '0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c'
    }
  },
  arweave: {
    coingeckoId: 'arweave',
    symbol: 'ar',
    name: 'Arweave',
    image: 'https://assets.coingecko.com/coins/images/4343/large/oRt6SiEN_400x400.jpg?1591059616',
    contractAddress: {}
  },
  dydx: {
    coingeckoId: 'dydx',
    symbol: 'dydx',
    name: 'dYdX',
    image: 'https://assets.coingecko.com/coins/images/17500/large/hjnIm9bV.jpg?1628009360',
    contractAddress: {
      1: '0x92d6c1e31e14520e676a687f0a93788b716beff5'
    }
  },
  illuvium: {
    coingeckoId: 'illuvium',
    symbol: 'ilv',
    name: 'Illuvium',
    image: 'https://assets.coingecko.com/coins/images/14468/large/logo-200x200.png?1682415398',
    contractAddress: {
      1: '0x767fe9edc9e0df98e07454847909b5e959d7ca0e'
    }
  },
  chia: {
    coingeckoId: 'chia',
    symbol: 'xch',
    name: 'Chia',
    image: 'https://assets.coingecko.com/coins/images/15174/large/zV5K5y9f_400x400.png?1620024414',
    contractAddress: {}
  },
  singularitynet: {
    coingeckoId: 'singularitynet',
    symbol: 'agix',
    name: 'SingularityNET',
    image: 'https://assets.coingecko.com/coins/images/2138/large/singularitynet.png?1548609559',
    contractAddress: {
      1: '0x5b7533812759b45c2b44c19e320ba2cd2681b542'
    }
  },
  defichain: {
    coingeckoId: 'defichain',
    symbol: 'dfi',
    name: 'DeFiChain',
    image: 'https://assets.coingecko.com/coins/images/11757/large/symbol-defi-blockchain_200.png?1597306538',
    contractAddress: {
      1: '0x8fc8f8269ebca376d046ce292dc7eac40c8d358a',
      56: '0x361c60b7c2828fcab80988d00d1d542c83387b50'
    }
  },
  nem: {
    coingeckoId: 'nem',
    symbol: 'xem',
    name: 'NEM',
    image: 'https://assets.coingecko.com/coins/images/242/large/NEM_WC_Logo_200px.png?1642668663',
    contractAddress: {}
  },
  'huobi-btc': {
    coingeckoId: 'huobi-btc',
    symbol: 'hbtc',
    name: 'Huobi BTC',
    image: 'https://assets.coingecko.com/coins/images/12407/large/Unknown-5.png?1599624896',
    contractAddress: {
      1: '0x0316eb71485b0ab14103307bf65a021042c6d380'
    }
  },
  'escoin-token': {
    coingeckoId: 'escoin-token',
    symbol: 'elg',
    name: 'Escoin',
    image: 'https://assets.coingecko.com/coins/images/13566/large/escoin-200.png?1609833886',
    contractAddress: {
      1: '0xa2085073878152ac3090ea13d1e41bd69e60dc99'
    }
  },
  'tether-eurt': {
    coingeckoId: 'tether-eurt',
    symbol: 'eurt',
    name: 'Euro Tether',
    image: 'https://assets.coingecko.com/coins/images/17385/large/Tether_new.png?1683650223',
    contractAddress: {
      1: '0xc581b735a1688071a1746c968e0798d642ede491'
    }
  },
  'flex-coin': {
    coingeckoId: 'flex-coin',
    symbol: 'flex',
    name: 'FLEX Coin',
    image: 'https://assets.coingecko.com/coins/images/9108/large/coinflex_logo.png?1628750583',
    contractAddress: {
      1: '0xfcf8eda095e37a41e002e266daad7efc1579bc0a'
    }
  },
  holotoken: {
    coingeckoId: 'holotoken',
    symbol: 'hot',
    name: 'Holo',
    image: 'https://assets.coingecko.com/coins/images/3348/large/Holologo_Profile.png?1547037966',
    contractAddress: {
      1: '0x6c6ee5e31d828de241282b9606c8e98ea48526e2'
    }
  },
  qtum: {
    coingeckoId: 'qtum',
    symbol: 'qtum',
    name: 'Qtum',
    image: 'https://assets.coingecko.com/coins/images/684/large/Qtum_Logo_blue_CG.png?1637155875',
    contractAddress: {}
  },
  'oasis-network': {
    coingeckoId: 'oasis-network',
    symbol: 'rose',
    name: 'Oasis Network',
    image: 'https://assets.coingecko.com/coins/images/13162/large/rose.png?1605772906',
    contractAddress: {}
  },
  'aleph-zero': {
    coingeckoId: 'aleph-zero',
    symbol: 'azero',
    name: 'Aleph Zero',
    image: 'https://assets.coingecko.com/coins/images/17212/large/gtmuTVa.png?1626853180',
    contractAddress: {}
  },
  link: {
    coingeckoId: 'link',
    symbol: 'fnsa',
    name: 'FINSCHIA',
    image: 'https://assets.coingecko.com/coins/images/6450/large/FINSCHIA_coin_icon%28black%29.png?1685058330',
    contractAddress: {}
  },
  'baby-doge-coin': {
    coingeckoId: 'baby-doge-coin',
    symbol: 'babydoge',
    name: 'Baby Doge Coin',
    image: 'https://assets.coingecko.com/coins/images/16125/large/babydoge.jpg?1676303229',
    contractAddress: {
      1: '0xac57de9c1a09fec648e93eb98875b212db0d460b',
      56: '0xc748673057861a797275cd8a068abb95a902e8de'
    }
  },
  olympus: {
    coingeckoId: 'olympus',
    symbol: 'ohm',
    name: 'Olympus',
    image: 'https://assets.coingecko.com/coins/images/14483/large/token_OHM_%281%29.png?1628311611',
    contractAddress: {
      1: '0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5'
    }
  },
  floki: {
    coingeckoId: 'floki',
    symbol: 'floki',
    name: 'FLOKI',
    image: 'https://assets.coingecko.com/coins/images/16746/large/PNG_image.png?1643184642',
    contractAddress: {
      1: '0xcf0c122c6b73ff809c693db761e7baebe62b6a2e',
      56: '0xfb5b838b6cfeedc2873ab27866079ac55363d37e'
    }
  },
  zcash: {
    coingeckoId: 'zcash',
    symbol: 'zec',
    name: 'Zcash',
    image: 'https://assets.coingecko.com/coins/images/486/large/circle-zcash-color.png?1547034197',
    contractAddress: {}
  },
  'bitcoin-gold': {
    coingeckoId: 'bitcoin-gold',
    symbol: 'btg',
    name: 'Bitcoin Gold',
    image: 'https://assets.coingecko.com/coins/images/1043/large/bitcoin-gold-logo.png?1547034978',
    contractAddress: {}
  },
  'theta-fuel': {
    coingeckoId: 'theta-fuel',
    symbol: 'tfuel',
    name: 'Theta Fuel',
    image: 'https://assets.coingecko.com/coins/images/8029/large/1_0YusgngOrriVg4ZYx4wOFQ.png?1553483622',
    contractAddress: {}
  },
  celo: {
    coingeckoId: 'celo',
    symbol: 'celo',
    name: 'Celo',
    image: 'https://assets.coingecko.com/coins/images/11090/large/InjXBNx9_400x400.jpg?1674707499',
    contractAddress: {}
  },
  ronin: {
    coingeckoId: 'ronin',
    symbol: 'ron',
    name: 'Ronin',
    image: 'https://assets.coingecko.com/coins/images/20009/large/ronin.jpg?1649184678',
    contractAddress: {}
  },
  ravencoin: {
    coingeckoId: 'ravencoin',
    symbol: 'rvn',
    name: 'Ravencoin',
    image: 'https://assets.coingecko.com/coins/images/3412/large/ravencoin.png?1548386057',
    contractAddress: {}
  },
  kusama: {
    coingeckoId: 'kusama',
    symbol: 'ksm',
    name: 'Kusama',
    image: 'https://assets.coingecko.com/coins/images/9568/large/m4zRhP5e_400x400.jpg?1576190080',
    contractAddress: {}
  },
  'btse-token': {
    coingeckoId: 'btse-token',
    symbol: 'btse',
    name: 'BTSE Token',
    image: 'https://assets.coingecko.com/coins/images/10807/large/BTSE_logo_Square.jpeg?1583965964',
    contractAddress: {
      1: '0x666d875c600aa06ac1cf15641361dec3b00432ef'
    }
  },
  'ethereum-name-service': {
    coingeckoId: 'ethereum-name-service',
    symbol: 'ens',
    name: 'Ethereum Name Service',
    image: 'https://assets.coingecko.com/coins/images/19785/large/acatxTm8_400x400.jpg?1635850140',
    contractAddress: {
      1: '0xc18360217d8f7ab5e7c516566761ea12ce7f9d72'
    }
  },
  'fetch-ai': {
    coingeckoId: 'fetch-ai',
    symbol: 'fet',
    name: 'Fetch.ai',
    image: 'https://assets.coingecko.com/coins/images/5681/large/Fetch.jpg?1572098136',
    contractAddress: {
      1: '0xaea46a60368a7bd060eec7df8cba43b7ef41ad85',
      56: '0x031b41e504677879370e9dbcf937283a8691fa7f'
    }
  },
  'convex-crv': {
    coingeckoId: 'convex-crv',
    symbol: 'cvxcrv',
    name: 'Convex CRV',
    image: 'https://assets.coingecko.com/coins/images/15586/large/convex-crv.png?1621255952',
    contractAddress: {
      1: '0x62b9c7356a2dc64a1969e19c23e4f579f9810aa7'
    }
  },
  helium: {
    coingeckoId: 'helium',
    symbol: 'hnt',
    name: 'Helium',
    image: 'https://assets.coingecko.com/coins/images/4284/large/Helium_HNT.png?1612620071',
    contractAddress: {}
  },
  balancer: {
    coingeckoId: 'balancer',
    symbol: 'bal',
    name: 'Balancer',
    image: 'https://assets.coingecko.com/coins/images/11683/large/Balancer.png?1592792958',
    contractAddress: {
      1: '0xba100000625a3754423978a60c9317c58a424e3d',
      137: '0x9a71012b13ca4d3d0cdc72a177df3ef03b0e76a3'
    }
  },
  decred: {
    coingeckoId: 'decred',
    symbol: 'dcr',
    name: 'Decred',
    image: 'https://assets.coingecko.com/coins/images/329/large/decred.png?1547034093',
    contractAddress: {}
  },
  just: {
    coingeckoId: 'just',
    symbol: 'jst',
    name: 'JUST',
    image: 'https://assets.coingecko.com/coins/images/11095/large/JUST.jpg?1588175394',
    contractAddress: {}
  },
  'compound-governance-token': {
    coingeckoId: 'compound-governance-token',
    symbol: 'comp',
    name: 'Compound',
    image: 'https://assets.coingecko.com/coins/images/10775/large/COMP.png?1592625425',
    contractAddress: {
      1: '0xc00e94cb662c3520282e6f5717214004a7f26888',
      56: '0x52ce071bd9b1c4b00a0b92d298c512478cad67e8',
      137: '0x8505b9d2254a7ae468c0e9dd10ccea3a837aef5c'
    }
  },
  'krypton-dao': {
    coingeckoId: 'krypton-dao',
    symbol: 'krd',
    name: 'Krypton DAO',
    image: 'https://assets.coingecko.com/coins/images/25467/large/krd.png?1651915442',
    contractAddress: {
      56: '0xb020805e0bc7f0e353d1343d67a239f417d57bbf'
    }
  },
  stepn: {
    coingeckoId: 'stepn',
    symbol: 'gmt',
    name: 'STEPN',
    image: 'https://assets.coingecko.com/coins/images/23597/large/gmt.png?1644658792',
    contractAddress: {
      1: '0xe3c408bd53c31c085a1746af401a4042954ff740',
      56: '0x3019bf2a2ef8040c242c9a4c5c4bd4c81678b2a1'
    }
  },
  swipe: {
    coingeckoId: 'swipe',
    symbol: 'sxp',
    name: 'SXP',
    image: 'https://assets.coingecko.com/coins/images/9368/large/swipe.png?1566792311',
    contractAddress: {
      1: '0x8ce9137d39326ad0cd6491fb5cc0cba0e089b6a9',
      56: '0x47bead2563dcbf3bf2c9407fea4dc236faba485a'
    }
  },
  'compound-usdt': {
    coingeckoId: 'compound-usdt',
    symbol: 'cusdt',
    name: 'cUSDT',
    image: 'https://assets.coingecko.com/coins/images/11621/large/cUSDT.png?1592113270',
    contractAddress: {
      1: '0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9'
    }
  },
  'yearn-finance': {
    coingeckoId: 'yearn-finance',
    symbol: 'yfi',
    name: 'yearn.finance',
    image: 'https://assets.coingecko.com/coins/images/11849/large/yearn-finance-yfi.png?1676174746',
    contractAddress: {
      1: '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e',
      137: '0xda537104d6a5edd53c6fbba9a898708e465260b6'
    }
  },
  audius: {
    coingeckoId: 'audius',
    symbol: 'audio',
    name: 'Audius',
    image: 'https://assets.coingecko.com/coins/images/12913/large/AudiusCoinLogo_2x.png?1603425727',
    contractAddress: {
      1: '0x18aaa7115705e8be94bffebde57af9bfc265b998'
    }
  },
  icon: {
    coingeckoId: 'icon',
    symbol: 'icx',
    name: 'ICON',
    image: 'https://assets.coingecko.com/coins/images/1060/large/icon-icx-logo.png?1547035003',
    contractAddress: {}
  },
  'alchemix-usd': {
    coingeckoId: 'alchemix-usd',
    symbol: 'alusd',
    name: 'Alchemix USD',
    image: 'https://assets.coingecko.com/coins/images/14114/large/Alchemix_USD.png?1614410406',
    contractAddress: {
      1: '0xbc6da0fe9ad5f3b0d58160288917aa56653660e9'
    }
  },
  golem: {
    coingeckoId: 'golem',
    symbol: 'glm',
    name: 'Golem',
    image: 'https://assets.coingecko.com/coins/images/542/large/Golem_Submark_Positive_RGB.png?1606392013',
    contractAddress: {
      1: '0x7dd9c5cba05e151c895fde1cf355c9a1d5da6429'
    }
  },
  'terra-luna-2': {
    coingeckoId: 'terra-luna-2',
    symbol: 'luna',
    name: 'Terra',
    image: 'https://assets.coingecko.com/coins/images/25767/large/01_Luna_color.png?1653556122',
    contractAddress: {}
  },
  'gains-farm': {
    coingeckoId: 'gains-farm',
    symbol: 'gfarm2',
    name: 'Gains Farm',
    image: 'https://assets.coingecko.com/coins/images/13703/large/gfarm_v2.png?1611035398',
    contractAddress: {
      1: '0x831091da075665168e01898c6dac004a867f1e1b',
      137: '0x7075cab6bcca06613e2d071bd918d1a0241379e2'
    }
  },
  astar: {
    coingeckoId: 'astar',
    symbol: 'astr',
    name: 'Astar',
    image: 'https://assets.coingecko.com/coins/images/22617/large/astr.png?1642314057',
    contractAddress: {}
  },
  ankr: {
    coingeckoId: 'ankr',
    symbol: 'ankr',
    name: 'Ankr Network',
    image: 'https://assets.coingecko.com/coins/images/4324/large/U85xTl2.png?1608111978',
    contractAddress: {
      1: '0x8290333cef9e6d528dd5618fb97a76f268f3edd4',
      56: '0xf307910a4c7bbc79691fd374889b36d8531b08e3',
      137: '0x101a023270368c0d50bffb62780f4afd4ea79c35'
    }
  },
  'bone-shibaswap': {
    coingeckoId: 'bone-shibaswap',
    symbol: 'bone',
    name: 'Bone ShibaSwap',
    image: 'https://assets.coingecko.com/coins/images/16916/large/bone_icon.png?1625625505',
    contractAddress: {
      1: '0x9813037ee2218799597d83d4a5b6f3b6778218d9'
    }
  },
  jasmycoin: {
    coingeckoId: 'jasmycoin',
    symbol: 'jasmy',
    name: 'JasmyCoin',
    image: 'https://assets.coingecko.com/coins/images/13876/large/JASMY200x200.jpg?1612473259',
    contractAddress: {
      1: '0x7420b4b9a0110cdc71fb720908340c03f9bc03ec'
    }
  },
  iotex: {
    coingeckoId: 'iotex',
    symbol: 'iotx',
    name: 'IoTeX',
    image: 'https://assets.coingecko.com/coins/images/3334/large/iotex-logo.png?1547037941',
    contractAddress: {
      1: '0x6fb3e0a217407efff7ca062d46c26e5d60a14d69'
    }
  },
  'ethereum-pow-iou': {
    coingeckoId: 'ethereum-pow-iou',
    symbol: 'ethw',
    name: 'EthereumPoW',
    image: 'https://assets.coingecko.com/coins/images/26997/large/logo-clear.png?1661311105',
    contractAddress: {}
  },
  ecomi: {
    coingeckoId: 'ecomi',
    symbol: 'omi',
    name: 'ECOMI',
    image: 'https://assets.coingecko.com/coins/images/4428/large/ECOMI.png?1557928886',
    contractAddress: {
      1: '0xed35af169af46a02ee13b9d79eb57d6d68c1749e'
    }
  },
  'wemix-token': {
    coingeckoId: 'wemix-token',
    symbol: 'wemix',
    name: 'WEMIX',
    image: 'https://assets.coingecko.com/coins/images/12998/large/wemixcoin_color_200.png?1666768971',
    contractAddress: {}
  },
  moonbeam: {
    coingeckoId: 'moonbeam',
    symbol: 'glmr',
    name: 'Moonbeam',
    image: 'https://assets.coingecko.com/coins/images/22459/large/glmr.png?1641880985',
    contractAddress: {}
  },
  '0x': {
    coingeckoId: '0x',
    symbol: 'zrx',
    name: '0x Protocol',
    image: 'https://assets.coingecko.com/coins/images/863/large/0x.png?1547034672',
    contractAddress: {
      1: '0xe41d2489571d322189246dafa5ebde1f4699f498'
    }
  },
  blur: {
    coingeckoId: 'blur',
    symbol: 'blur',
    name: 'Blur',
    image: 'https://assets.coingecko.com/coins/images/28453/large/blur.png?1670745921',
    contractAddress: {
      1: '0x5283d291dbcf85356a21ba090e6db59121208b44'
    }
  },
  'bitcoin-avalanche-bridged-btc-b': {
    coingeckoId: 'bitcoin-avalanche-bridged-btc-b',
    symbol: 'btc.b',
    name: 'Bitcoin Avalanche Bridged (BTC.b)',
    image: 'https://assets.coingecko.com/coins/images/26115/large/btcb.png?1655921693',
    contractAddress: {}
  },
  magic: {
    coingeckoId: 'magic',
    symbol: 'magic',
    name: 'Magic',
    image: 'https://assets.coingecko.com/coins/images/18623/large/magic.png?1656052146',
    contractAddress: {
      1: '0xb0c7a3ba49c7a6eaba6cd4a96c55a1391070ac9a'
    }
  },
  wax: {
    coingeckoId: 'wax',
    symbol: 'waxp',
    name: 'WAX',
    image: 'https://assets.coingecko.com/coins/images/1372/large/WAX_Coin_Tickers_P_512px.png?1602812260',
    contractAddress: {}
  },
  'dao-maker': {
    coingeckoId: 'dao-maker',
    symbol: 'dao',
    name: 'DAO Maker',
    image: 'https://assets.coingecko.com/coins/images/13915/large/4.png?1612838831',
    contractAddress: {
      1: '0x0f51bb10119727a7e5ea3538074fb341f56b09ad',
      56: '0x4d2d32d8652058bf98c772953e1df5c5c85d9f45'
    }
  },
  ontology: {
    coingeckoId: 'ontology',
    symbol: 'ont',
    name: 'Ontology',
    image: 'https://assets.coingecko.com/coins/images/3447/large/ONT.png?1583481820',
    contractAddress: {}
  },
  iostoken: {
    coingeckoId: 'iostoken',
    symbol: 'iost',
    name: 'IOST',
    image: 'https://assets.coingecko.com/coins/images/2523/large/IOST.png?1557555183',
    contractAddress: {}
  },
  seth2: {
    coingeckoId: 'seth2',
    symbol: 'seth2',
    name: 'sETH2',
    image: 'https://assets.coingecko.com/coins/images/16569/large/emerald256.png?1624494960',
    contractAddress: {
      1: '0xfe2e637202056d30016725477c5da089ab0a043a'
    }
  },
  tomochain: {
    coingeckoId: 'tomochain',
    symbol: 'tomo',
    name: 'TomoChain',
    image: 'https://assets.coingecko.com/coins/images/3416/large/Asset_59_2x.png?1582948925',
    contractAddress: {}
  },
  siacoin: {
    coingeckoId: 'siacoin',
    symbol: 'sc',
    name: 'Siacoin',
    image: 'https://assets.coingecko.com/coins/images/289/large/siacoin.png?1548386465',
    contractAddress: {}
  },
  waves: {
    coingeckoId: 'waves',
    symbol: 'waves',
    name: 'Waves',
    image: 'https://assets.coingecko.com/coins/images/425/large/waves.png?1548386117',
    contractAddress: {
      1: '0x1cf4592ebffd730c7dc92c1bdffdfc3b9efcf29a'
    }
  },
  'stasis-eurs': {
    coingeckoId: 'stasis-eurs',
    symbol: 'eurs',
    name: 'STASIS EURO',
    image: 'https://assets.coingecko.com/coins/images/5164/large/EURS_300x300.png?1550571779',
    contractAddress: {
      1: '0xdb25f211ab05b1c97d595516f45794528a807ad8',
      137: '0xe111178a87a3bff0c8d18decba5798827539ae99'
    }
  },
  safepal: {
    coingeckoId: 'safepal',
    symbol: 'sfp',
    name: 'SafePal',
    image: 'https://assets.coingecko.com/coins/images/13905/large/sfp.png?1660381192',
    contractAddress: {
      56: '0xd41fdb03ba84762dd66a0af1a6c8540ff1ba5dfb'
    }
  },
  harmony: {
    coingeckoId: 'harmony',
    symbol: 'one',
    name: 'Harmony',
    image: 'https://assets.coingecko.com/coins/images/4344/large/Y88JAze.png?1565065793',
    contractAddress: {}
  },
  'tribe-2': {
    coingeckoId: 'tribe-2',
    symbol: 'tribe',
    name: 'Tribe',
    image: 'https://assets.coingecko.com/coins/images/14575/large/tribe.PNG?1617487954',
    contractAddress: {
      1: '0xc7283b66eb1eb5fb86327f08e1b5816b0720212b'
    }
  },
  bora: {
    coingeckoId: 'bora',
    symbol: 'bora',
    name: 'BORA',
    image: 'https://assets.coingecko.com/coins/images/7646/large/mqFw8hxm_400x400.jpeg?1656657343',
    contractAddress: {
      1: '0x26fb86579e371c7aedc461b2ddef0a8628c93d3b'
    }
  },
  kadena: {
    coingeckoId: 'kadena',
    symbol: 'kda',
    name: 'Kadena',
    image: 'https://assets.coingecko.com/coins/images/3693/large/Logo.png?1686042789',
    contractAddress: {}
  },
  'band-protocol': {
    coingeckoId: 'band-protocol',
    symbol: 'band',
    name: 'Band Protocol',
    image: 'https://assets.coingecko.com/coins/images/9545/large/Band_token_blue_violet_token.png?1625881431',
    contractAddress: {
      1: '0xba11d00c5f74255f56a5e366f4f77f5a186d7f55'
    }
  },
  aelf: {
    coingeckoId: 'aelf',
    symbol: 'elf',
    name: 'aelf',
    image: 'https://assets.coingecko.com/coins/images/1371/large/aelf-logo.png?1547035397',
    contractAddress: {
      1: '0xbf2179859fc6d5bee9bf9158632dc51678a4100e'
    }
  },
  'edu-coin': {
    coingeckoId: 'edu-coin',
    symbol: 'edu',
    name: 'Open Campus',
    image: 'https://assets.coingecko.com/coins/images/29948/large/EDU_Logo.png?1682327357',
    contractAddress: {
      1: '0x26aad156ba8efa501b32b42ffcdc8413f90e9c99',
      56: '0xbdeae1ca48894a1759a8374d63925f21f2ee2639',
      137: '0xb03e3b00baf9954bf1604d09a4dbd5cf88e1f695'
    }
  },
  'ocean-protocol': {
    coingeckoId: 'ocean-protocol',
    symbol: 'ocean',
    name: 'Ocean Protocol',
    image: 'https://assets.coingecko.com/coins/images/3687/large/ocean-protocol-logo.jpg?1547038686',
    contractAddress: {
      1: '0x967da4048cd07ab37855c090aaf366e4ce1b9f48'
    }
  },
  'wrapped-beacon-eth': {
    coingeckoId: 'wrapped-beacon-eth',
    symbol: 'wbeth',
    name: 'Wrapped Beacon ETH',
    image: 'https://assets.coingecko.com/coins/images/30061/large/wbeth-icon.png?1683001548',
    contractAddress: {
      1: '0xa2e3356610840701bdf5611a53974510ae27e2e1',
      56: '0xa2e3356610840701bdf5611a53974510ae27e2e1'
    }
  },
  aragon: {
    coingeckoId: 'aragon',
    symbol: 'ant',
    name: 'Aragon',
    image: 'https://assets.coingecko.com/coins/images/681/large/Avatar_Circle_x6.png?1685684270',
    contractAddress: {
      1: '0xa117000000f279d81a1d3cc75430faa017fa5a2e'
    }
  },
  'bitkub-coin': {
    coingeckoId: 'bitkub-coin',
    symbol: 'kub',
    name: 'Bitkub Coin',
    image: 'https://assets.coingecko.com/coins/images/15760/large/KUB.png?1621825161',
    contractAddress: {}
  },
  blox: {
    coingeckoId: 'blox',
    symbol: 'cdt',
    name: 'Blox',
    image: 'https://assets.coingecko.com/coins/images/1231/large/Blox_Staking_Logo_2.png?1609117544',
    contractAddress: {
      1: '0x177d39ac676ed1c67a2b268ad7f1e58826e5b0af'
    }
  },
  'lukso-token': {
    coingeckoId: 'lukso-token',
    symbol: 'lyxe',
    name: 'LUKSO',
    image: 'https://assets.coingecko.com/coins/images/11423/large/1_QAHTciwVhD7SqVmfRW70Pw.png?1590110612',
    contractAddress: {
      1: '0xa8b919680258d369114910511cc87595aec0be6d'
    }
  },
  zelcash: {
    coingeckoId: 'zelcash',
    symbol: 'flux',
    name: 'Flux',
    image: 'https://assets.coingecko.com/coins/images/5163/large/Flux_symbol_blue-white.png?1617192144',
    contractAddress: {}
  },
  'energy-web-token': {
    coingeckoId: 'energy-web-token',
    symbol: 'ewt',
    name: 'Energy Web',
    image: 'https://assets.coingecko.com/coins/images/10886/large/R9gQTJV__400x400.png?1585604557',
    contractAddress: {}
  },
  astrafer: {
    coingeckoId: 'astrafer',
    symbol: 'astrafer',
    name: 'Astrafer',
    image: 'https://assets.coingecko.com/coins/images/26246/large/ATSRA_Token.png?1657276411',
    contractAddress: {
      1: '0x97bbbc5d96875fb78d2f14b7ff8d7a3a74106f17',
      137: '0xdfce1e99a31c4597a3f8a8945cbfa9037655e335'
    }
  },
  'gains-network': {
    coingeckoId: 'gains-network',
    symbol: 'gns',
    name: 'Gains Network',
    image: 'https://assets.coingecko.com/coins/images/19737/large/logo.png?1635909203',
    contractAddress: {
      137: '0xe5417af564e4bfda1c483642db72007871397896'
    }
  },
  biconomy: {
    coingeckoId: 'biconomy',
    symbol: 'bico',
    name: 'Biconomy',
    image: 'https://assets.coingecko.com/coins/images/21061/large/biconomy_logo.jpg?1638269749',
    contractAddress: {
      1: '0xf17e65822b568b3903685a7c9f496cf7656cc6c2'
    }
  },
  bilira: {
    coingeckoId: 'bilira',
    symbol: 'tryb',
    name: 'BiLira',
    image: 'https://assets.coingecko.com/coins/images/10119/large/JBs9jiXO_400x400.jpg?1642668342',
    contractAddress: {
      1: '0x2c537e5624e4af88a7ae4060c022609376c8d0eb',
      56: '0xc1fdbed7dac39cae2ccc0748f7a80dc446f6a594',
      137: '0x4fb71290ac171e1d144f7221d882becac7196eb5'
    }
  },
  'akash-network': {
    coingeckoId: 'akash-network',
    symbol: 'akt',
    name: 'Akash Network',
    image: 'https://assets.coingecko.com/coins/images/12785/large/akash-logo.png?1615447676',
    contractAddress: {}
  },
  axelar: {
    coingeckoId: 'axelar',
    symbol: 'axl',
    name: 'Axelar',
    image: 'https://assets.coingecko.com/coins/images/27277/large/V-65_xQ1_400x400.jpeg?1663121730',
    contractAddress: {
      1: '0x467719ad09025fcc6cf6f8311755809d45a5e5f3',
      56: '0x8b1f4432f943c465a973fedc6d7aa50fc96f1f65',
      137: '0x6e4e624106cb12e168e6533f8ec7c82263358940'
    }
  },
  joe: {
    coingeckoId: 'joe',
    symbol: 'joe',
    name: 'JOE',
    image: 'https://assets.coingecko.com/coins/images/17569/large/traderjoe.png?1685690062',
    contractAddress: {
      56: '0x371c7ec6d8039ff7933a2aa28eb827ffe1f52f07'
    }
  },
  'ssv-network': {
    coingeckoId: 'ssv-network',
    symbol: 'ssv',
    name: 'SSV Network',
    image: 'https://assets.coingecko.com/coins/images/19155/large/ssv.png?1638181902',
    contractAddress: {
      1: '0x9d65ff81a3c488d585bbfb0bfe3c7707c7917f54'
    }
  },
  'ribbon-finance': {
    coingeckoId: 'ribbon-finance',
    symbol: 'rbn',
    name: 'Ribbon Finance',
    image: 'https://assets.coingecko.com/coins/images/15823/large/RBN_64x64.png?1633529723',
    contractAddress: {
      1: '0x6123b0049f904d730db3c36a31167d9d4121fa6b'
    }
  },
  'amp-token': {
    coingeckoId: 'amp-token',
    symbol: 'amp',
    name: 'Amp',
    image: 'https://assets.coingecko.com/coins/images/12409/large/amp-200x200.png?1599625397',
    contractAddress: {
      1: '0xff20817765cb7f73d4bde2e66e067e58d11095c2'
    }
  },
  skale: {
    coingeckoId: 'skale',
    symbol: 'skl',
    name: 'SKALE',
    image: 'https://assets.coingecko.com/coins/images/13245/large/SKALE_token_300x300.png?1606789574',
    contractAddress: {
      1: '0x00c83aecc790e8a4453e5dd3b0b4b3680501a7a7'
    }
  },
  hive: {
    coingeckoId: 'hive',
    symbol: 'hive',
    name: 'Hive',
    image: 'https://assets.coingecko.com/coins/images/10840/large/logo_transparent_4x.png?1584623184',
    contractAddress: {}
  },
  'stargate-finance': {
    coingeckoId: 'stargate-finance',
    symbol: 'stg',
    name: 'Stargate Finance',
    image: 'https://assets.coingecko.com/coins/images/24413/large/STG_LOGO.png?1647654518',
    contractAddress: {
      1: '0xaf5191b0de278c7286d6c7cc6ab6bb8a73ba2cd6',
      56: '0xb0d502e938ed5f4df2e681fe6e419ff29631d62b',
      137: '0x2f6f07cdcf3588944bf4c42ac74ff24bf56e7590'
    }
  },
  sushi: {
    coingeckoId: 'sushi',
    symbol: 'sushi',
    name: 'Sushi',
    image: 'https://assets.coingecko.com/coins/images/12271/large/512x512_Logo_no_chop.png?1606986688',
    contractAddress: {
      1: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
      56: '0x947950bcc74888a40ffa2593c5798f11fc9124c4',
      137: '0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a'
    }
  },
  uma: {
    coingeckoId: 'uma',
    symbol: 'uma',
    name: 'UMA',
    image: 'https://assets.coingecko.com/coins/images/10951/large/UMA.png?1586307916',
    contractAddress: {
      1: '0x04fa0d235c4abf4bcf4787af4cf447de572ef828'
    }
  },
  swissborg: {
    coingeckoId: 'swissborg',
    symbol: 'chsb',
    name: 'SwissBorg',
    image: 'https://assets.coingecko.com/coins/images/2117/large/YJUrRy7r_400x400.png?1589794215',
    contractAddress: {
      1: '0xba9d4199fab4f26efe3551d490e3821486f135ba'
    }
  },
  insure: {
    coingeckoId: 'insure',
    symbol: 'sure',
    name: 'inSure DeFi',
    image: 'https://assets.coingecko.com/coins/images/10354/large/logo-grey-circle.png?1614910406',
    contractAddress: {
      1: '0xcb86c6a22cb56b6cf40cafedb06ba0df188a416e',
      56: '0x9b17baadf0f21f03e35249e0e59723f34994f806',
      137: '0xf88332547c680f755481bf489d890426248bb275'
    }
  },
  digibyte: {
    coingeckoId: 'digibyte',
    symbol: 'dgb',
    name: 'DigiByte',
    image: 'https://assets.coingecko.com/coins/images/63/large/digibyte.png?1547033717',
    contractAddress: {}
  },
  'synapse-2': {
    coingeckoId: 'synapse-2',
    symbol: 'syn',
    name: 'Synapse',
    image: 'https://assets.coingecko.com/coins/images/18024/large/synapse_social_icon.png?1663921797',
    contractAddress: {
      1: '0x0f2d719407fdbeff09d87557abb7232601fd9f29',
      56: '0xa4080f1778e69467e905b8d6f72f6e441f9e9484',
      137: '0xf8f9efc0db77d8881500bb06ff5d6abc3070e695'
    }
  },
  livepeer: {
    coingeckoId: 'livepeer',
    symbol: 'lpt',
    name: 'Livepeer',
    image: 'https://assets.coingecko.com/coins/images/7137/large/logo-circle-green.png?1619593365',
    contractAddress: {
      1: '0x58b6a8a3302369daec383334672404ee733ab239'
    }
  },
  'canvas-n-glr': {
    coingeckoId: 'canvas-n-glr',
    symbol: 'glr',
    name: 'GalleryCoin',
    image: 'https://assets.coingecko.com/coins/images/29372/large/%EA%B0%A4%EB%9F%AC%EB%A6%AC%EC%BD%94%EC%9D%B8_%EB%A1%9C%EA%B3%A0%28200_200%29.png?1678350274',
    contractAddress: {
      1: '0xd54619e0b9899d74cc9b981354eb6b59732c43b1'
    }
  },
  'utility-web3shot': {
    coingeckoId: 'utility-web3shot',
    symbol: 'uw3s',
    name: 'Utility Web3Shot',
    image: 'https://assets.coingecko.com/coins/images/29445/large/uw3s.png?1679159052',
    contractAddress: {
      56: '0x961e149db8bfbdb318c182152725ac806d7be3f4'
    }
  },
  terrausd: {
    coingeckoId: 'terrausd',
    symbol: 'ustc',
    name: 'TerraClassicUSD',
    image: 'https://assets.coingecko.com/coins/images/12681/large/UST.png?1653548090',
    contractAddress: {}
  },
  lisk: {
    coingeckoId: 'lisk',
    symbol: 'lsk',
    name: 'Lisk',
    image: 'https://assets.coingecko.com/coins/images/385/large/Lisk_Symbol_-_Blue.png?1573444104',
    contractAddress: {}
  },
  stride: {
    coingeckoId: 'stride',
    symbol: 'strd',
    name: 'Stride',
    image: 'https://assets.coingecko.com/coins/images/27275/large/STRD_800.png?1663116708',
    contractAddress: {}
  },
  coredaoorg: {
    coingeckoId: 'coredaoorg',
    symbol: 'core',
    name: 'Core',
    image: 'https://assets.coingecko.com/coins/images/28938/large/coredao.png?1675503751',
    contractAddress: {}
  },
  ordinals: {
    coingeckoId: 'ordinals',
    symbol: 'ordi',
    name: 'ORDI',
    image: 'https://assets.coingecko.com/coins/images/30162/large/ordi.png?1683527689',
    contractAddress: {}
  },
  'coinex-token': {
    coingeckoId: 'coinex-token',
    symbol: 'cet',
    name: 'CoinEx',
    image: 'https://assets.coingecko.com/coins/images/4817/large/coinex-token.png?1547040183',
    contractAddress: {
      1: '0x081f67afa0ccf8c7b17540767bbe95df2ba8d97f'
    }
  },
  'vvs-finance': {
    coingeckoId: 'vvs-finance',
    symbol: 'vvs',
    name: 'VVS Finance',
    image: 'https://assets.coingecko.com/coins/images/20210/large/8glAYOTM_400x400.jpg?1636667919',
    contractAddress: {
      1: '0x839e71613f9aa06e5701cf6de63e303616b0dde3'
    }
  },
  'dogelon-mars': {
    coingeckoId: 'dogelon-mars',
    symbol: 'elon',
    name: 'Dogelon Mars',
    image: 'https://assets.coingecko.com/coins/images/14962/large/6GxcPRo3_400x400.jpg?1619157413',
    contractAddress: {
      1: '0x761d38e5ddf6ccf6cf7c55759d5210750b5d60f3',
      56: '0x7bd6fabd64813c48545c9c0e312a0099d9be2540',
      137: '0xe0339c80ffde91f3e20494df88d4206d86024cdf'
    }
  },
  'safemoon-2': {
    coingeckoId: 'safemoon-2',
    symbol: 'sfm',
    name: 'SafeMoon',
    image: 'https://assets.coingecko.com/coins/images/21863/large/photo_2021-12-22_14.43.36.jpeg?1640155440',
    contractAddress: {
      56: '0x42981d0bfbaf196529376ee702f2a9eb9092fcb5'
    }
  },
  nym: {
    coingeckoId: 'nym',
    symbol: 'nym',
    name: 'Nym',
    image: 'https://assets.coingecko.com/coins/images/24488/large/NYM_Token.png?1649926353',
    contractAddress: {
      1: '0x525a8f6f3ba4752868cde25164382bfbae3990e1'
    }
  },
  telcoin: {
    coingeckoId: 'telcoin',
    symbol: 'tel',
    name: 'Telcoin',
    image: 'https://assets.coingecko.com/coins/images/1899/large/tel.png?1547036203',
    contractAddress: {
      1: '0x467bccd9d29f223bce8043b84e8c8b282827790f',
      137: '0xdf7837de1f2fa4631d716cf2502f8b230f1dcc32'
    }
  },
  everscale: {
    coingeckoId: 'everscale',
    symbol: 'ever',
    name: 'Everscale',
    image: 'https://assets.coingecko.com/coins/images/12783/large/everscale_badge_main_round_1x.png?1640050196',
    contractAddress: {
      1: '0x29d578cec46b50fa5c88a99c6a4b70184c062953',
      56: '0x0a7e7d210c45c4abba183c1d0551b53ad1756eca'
    }
  },
  polymath: {
    coingeckoId: 'polymath',
    symbol: 'poly',
    name: 'Polymath',
    image: 'https://assets.coingecko.com/coins/images/2784/large/inKkF01.png?1605007034',
    contractAddress: {
      1: '0x9992ec3cf6a55b00978cddf2b27bc6882d88d1ec'
    }
  },
  'e-radix': {
    coingeckoId: 'e-radix',
    symbol: 'exrd',
    name: 'e-Radix',
    image: 'https://assets.coingecko.com/coins/images/13145/large/exrd_logo.png?1605662677',
    contractAddress: {
      1: '0x6468e79a80c0eab0f9a2b574c8d5bc374af59414'
    }
  },
  'alchemy-pay': {
    coingeckoId: 'alchemy-pay',
    symbol: 'ach',
    name: 'Alchemy Pay',
    image: 'https://assets.coingecko.com/coins/images/12390/large/ACH_%281%29.png?1599691266',
    contractAddress: {
      1: '0xed04915c23f00a313a544955524eb7dbd823143d',
      56: '0xbc7d6b50616989655afd682fb42743507003056d'
    }
  },
  'reserve-rights-token': {
    coingeckoId: 'reserve-rights-token',
    symbol: 'rsr',
    name: 'Reserve Rights',
    image: 'https://assets.coingecko.com/coins/images/8365/large/rsr.png?1637983320',
    contractAddress: {
      1: '0x320623b8e4ff03373931769a31fc52a4e78b5d70'
    }
  },
  'nervos-network': {
    coingeckoId: 'nervos-network',
    symbol: 'ckb',
    name: 'Nervos Network',
    image: 'https://assets.coingecko.com/coins/images/9566/large/Nervos_White.png?1608280856',
    contractAddress: {}
  },
  cartesi: {
    coingeckoId: 'cartesi',
    symbol: 'ctsi',
    name: 'Cartesi',
    image: 'https://assets.coingecko.com/coins/images/11038/large/cartesi.png?1592288021',
    contractAddress: {
      1: '0x491604c0fdf08347dd1fa4ee062a822a5dd06b5d',
      56: '0x8da443f84fea710266c8eb6bc34b71702d033ef2',
      137: '0x2727ab1c2d22170abc9b595177b2d5c6e1ab7b7b'
    }
  }
};

export const nativeAssetData: { [key: string]: string } = {
  1: 'ethereum',
  56: 'binancecoin',
  137: 'matic-network'
};

export const EVM_NATIVE_DECIMAL = 18;

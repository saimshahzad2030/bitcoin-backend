const axios = require("axios");
const { google } = require("googleapis");
const {
  PRIVATE_KEY,
  PRIVATE_KEY_ID,
  PROJECT_ID,
  CLIENT_EMAIL,
  CLIENT_ID,
  CLIENT_X509_CERT_URL,
  AUTH_UTI,
  TOKEN_URI,
  AUTH_PROVIDE_X509_CERT_URL,
  SPREADSHEET_ID,
  SCOPES,
} = require("../config/config");
const auth = new google.auth.GoogleAuth({
  credentials: {
    type: "service_account",
    private_key: PRIVATE_KEY.replace(/\\n/g, "\n"),
    project_id: PROJECT_ID,
    client_email: CLIENT_EMAIL,
    private_key_id: PRIVATE_KEY_ID,
    client_id: CLIENT_ID,
    auth_uri: AUTH_UTI,
    token_uri: TOKEN_URI,
    auth_provider_x509_cert_url: AUTH_PROVIDE_X509_CERT_URL,
    client_x509_cert_url: CLIENT_X509_CERT_URL,
  },
  scopes: SCOPES,
});
const fetchSingleCoin = async (req, res) => {
  try {
    const { uuid } = req.query;
    if (!uuid) {
      return res.status(400).json({
        message: "Please provide the uuid of coin",
      });
    }
    const { coin } = req.query;
    if (!coin) {
      return res.status(400).json({
        message: "Please provide the name of coin",
      });
    }
    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = SPREADSHEET_ID;
    const range = `Sheet1!A2:T`;
    const responseSheet = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const values = responseSheet.data.values;
    const coinNameIndex = 19;

    const coinRow = values.findIndex((row) => row[coinNameIndex] === coin);

    if (coinRow === -1) {
      return res.status(404).json({
        message: "Coin not found",
      });
    }
    const coinProperties = values[coinRow].slice(1);
    const coinDetails = {
      name: coin,
      currentPrice: coinProperties[0],
      supplyInQ42025: coinProperties[1],
      Now: coinProperties[2],
      "2022 LOW": coinProperties[3],
      "2021/ATH": coinProperties[4],
      "2022 LOW => NOW": coinProperties[5],
      "(Maintain DOM. | $3T Global M.C)": coinProperties[6],
      "(2024 => 2025)": coinProperties[7],
      "(AVG. Growth | $7T Global M.C)": coinProperties[8],
      "(10X DOM. | $10T Global M.C)": coinProperties[9],
      "MAX Prediction (Data) Price": coinProperties[10],
      "MAX Prediction (Data) (EST.) Market Cap": coinProperties[11],
      "MAX Prediction (Data) Multiple (X)": coinProperties[12],
      "MAX Ladder Sell Level (-25%)	Price": coinProperties[13],
      "MAX Ladder Sell Level (-25%)(Multiple (X))": coinProperties[14],
      "Kyren's MAX Prediction (Subjective)	Price": coinProperties[15],
      "Kyren's MAX Prediction (Subjective)	(EST.) Market Cap":
        coinProperties[16],
      "Kyren's MAX Prediction (Subjective)	Multiple (X)": coinProperties[17],
    };
    const options = {
      method: "GET",
      url: `https://coinranking1.p.rapidapi.com/coin/${uuid}/history`,
      params: {
        timePeriod: "1y",
      },
      headers: {
        "X-RapidAPI-Key": "ed54dfe28dmsh8fa15132e454773p12efc1jsn492a55fb9af3",
        "X-RapidAPI-Host": "coinranking1.p.rapidapi.com",
      },
    };
    const response = await axios.request(options);
    const prices = response.data.data.history.map((entry) =>
      parseFloat(entry.price)
    );

    // const prices = prices2.filter((_, index) => (index + 1) % 7 === 1);
    // res.status(200).json({ coinDetails, prices: prices.reverse() });
    res.status(200).json({ coinDetails, prices: prices.reverse() });
  } catch (error) {
    console.error(error);
  }
};

const fetchAllCoins = async (req, res) => {
  try {
    const coinsArray = [
      "Aave",
      "Akash", //modified
      "Aleph Zero",
      "Algorand",
      "AMP", //modified
      "API3",
      "Aptos",
      "ARBITRUM", //modified
      "Arweave",
      "Astar",
      "Avalanche",
      "Axelar",
      "Axie Infinity",
      "BEAM", //modified
      "Bitcoin Cash",
      "Bitcoin SV",
      "BitTorrent-New", //modified
      "Bittensor",
      "BLUR", //modified
      "Cardano",
      "Casper",
      "Celestia",
      "Chainlink",
      "CryptoForeX",
      "Cosmos",
      "Cronos",
      "Decentraland",
      "dYdX Token", //modified
      "Energy Web Token",
      "Enjin Coin",
      "EOS",
      "Ethereum",
      "Ethereum Classic",
      "Fantom",
      "Fetch.AI", //modified
      "Filecoin",
      "Flux",
      "Flare Network", //modified
      "Gala ", //modified
      "GameSwift",
      "Hedera",
      "Helium",
      "Illuvium",
      "Immutable X", //modified
      "Injective Protocol", //modified
      "Internet Computer (DFINITY)", //modified
      "IOTA",
      "Kadena",
      "Kaspa",
      "Kava",
      "Klaytn",
      "Kusama",
      "Liechtenstein Cryptoassets Exchange", //modified
      "Litecoin",
      "Manta", //modified
      "Mantle",
      "Mina Protocol Token", //modified
      "Monero",
      "Moonbeam",
      "Moonriver",
      "Morpheus.Network",
      "MultiversX",
      "NEAR Protocol", //modified
      "NEO", //modified
      "Oasis Network",
      "Octopus Network", //modified
      "Optimism",
      "ordi", //moddified
      "Osmosis",
      "PancakeSwap",
      "Pendle",
      "Polkadot",
      "Polkastarter",
      "Polygon",
      "Pyth Network",
      "Quant",
      "Render Token", //modified
      "Reserve Rights Token", //modified
      "Rollbit Coin",
      "SATS",
      "SEI", //modified
      "SingularityNET",
      "Siacoin",
      "Solana",
      "Stacks",
      "Stellar",
      "Sui Network", //modified
      "Synthetix Network", //modified
      "Tezos",
      "The Graph",
      "The Sandbox",
      "Theta Token", //modified
      "THORChain",
      "TRON", //modified
      "Uniswap",
      "VeChain",
      "Verasity",
      "WOO Network", //modified
      "XinFin Network", //modified
      "XRP",
      "AltLayer Token", //modified
      "Hivemapper",
      "COTI", //modified
    ];
    const options = {
      method: "GET",
      url: "https://coinranking1.p.rapidapi.com/coins",
      params: {
        timePeriod: "24h",
        "tiers[0]": "1",
        // orderBy: "marketCap",
        orderBy: "price",
        orderDirection: "asc", // Order by ascending alphabetical order
        limit: "770",
        offset: "0",
      },
      headers: {
        "X-RapidAPI-Key": "ed54dfe28dmsh8fa15132e454773p12efc1jsn492a55fb9af3",
        "X-RapidAPI-Host": "coinranking1.p.rapidapi.com",
      },
    };
    const response = await axios.request(options);

    const simplifiedCoins = response.data.data.coins.map(({ uuid, name }) => ({
      uuid,
      name,
    }));

    const filteredCoins = simplifiedCoins.filter((coin) =>
      coinsArray.includes(coin.name)
    );
    const notMatchedCoins = coinsArray.filter(
      (coinName) => !filteredCoins.find((coin) => coin.name === coinName)
    );
    // res.status(200).send(response.data.data.history);
    res.status(200).json({
      //   notmatchedcount: notMatchedCoins.length,
      //   matchedcount: filteredCoins.length,
      notMatchedCoins,
      filteredCoins,
      //   filter: response.data.data.coins.filter((coin) => coin.name === "SATS"),

      //   allcoins: response.data.data.coins.map(({ uuid, name, symbol }) => ({
      //     uuid,
      //     name,
      //     symbol,
      //   })),
    });

    // const options = {
    //   method: "GET",
    //   url: "https://api.tokenmetrics.com/v2/annualized-historical-volatility-charts?timeFrame=MAX&chartFilters=market_cap%2C%20volatility_index%2C%2090th_percentile%2C%2010th_percentile",
    //   headers: {
    //     accept: "application/json",
    //     api_key: "tm-bd5d1d83-ef3f-43b0-8252-58253ada60e5",
    //   },
    // };

    // axios
    //   .request(options)
    //   .then(function (response) {
    //     console.log(response.data);
    //   })
    //   .catch(function (error) {
    //     console.error(error);
    //   });
  } catch (error) {
    console.error(error);
  }
};

module.exports = { fetchSingleCoin, fetchAllCoins };

const options = {
  method: "GET",
  url: "https://api.tokenmetrics.com/v2/price-prediction?token_id=3375%2C3306&symbol=BTC%2CETH&category=layer-1%2Cnft&exchange=binance%2Cgate&limit=1000&page=0",
  headers: {
    accept: "application/json",
    api_key: "tm-********-****-****-****-************",
  },
};

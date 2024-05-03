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
const fetchData = async (req, res) => {
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = SPREADSHEET_ID;
  const range = `Sheet1!A3:A`;
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const values = response.data.values;
    const coins = values.map((row) => row[0]);
    res.json({
      coins,
    });
  } catch (error) {
    res.status(520).json({
      message: error,
    });
  }
};
const fetchsingleCoinController = async (req, res) => {
  const { coin } = req.query;
  if (!coin) {
    return res.status(400).json({
      message: "Please provide the name of coin",
    });
  }
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = SPREADSHEET_ID;
  const range = `Sheet1!A2:S`;
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const values = response.data.values;
    const coinNameIndex = 0; // Assuming coin names are in the first column

    // Find the row where the coin name matches
    const coinRow = values.findIndex((row) => row[coinNameIndex] === coin);

    if (coinRow === -1) {
      return res.status(404).json({
        message: "Coin not found",
      });
    }

    // Get the properties of the coin
    const coinProperties = values[coinRow].slice(1); // Assuming properties start from the second column
    console.log(coinProperties);
    console.log(values[0]);
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
    res.json({
      coinDetails,
    });
  } catch (error) {
    res.status(520).json({
      message: error,
    });
  }
};
module.exports = { fetchData, fetchsingleCoinController };

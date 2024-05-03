require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_KEY;
const PORT = process.env.PORT;
const SUPA_DB_URL = process.env.SUPA_DB_URI;
const SUPA_DB_API_KEY = process.env.SUPA_DB_API_KEY;
const STRIPE_SECRET = process.env.STRIPE_SECRET;
const CLIENT_URL = process.env.CLIENT_URL;
const PRODUCT_ID = process.env.PRODUCT_ID;
const WEBHOOK_KEY = process.env.WEBHOOK_KEY;
const PROJECT_ID = process.env.PROJECT_ID;
const PRIVATE_KEY_ID = process.env.PRIVATE_KEY_ID;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CLIENT_EMAIL = process.env.CLIENT_EMAIL;
const CLIENT_ID = process.env.CLIENT_ID;
const AUTH_URI = process.env.AUTH_URI;
const TOKEN_URI = process.env.TOKEN_URI;
const AUTH_PROVIDE_X509_CERT_URL = process.env.AUTH_PROVIDE_X509_CERT_URL;
const CLIENT_X509_CERT_URL = process.env.CLIENT_X509_CERT_URL;
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SCOPES = process.env.SCOPES;
module.exports = {
  JWT_SECRET_KEY,
  PORT,
  SUPA_DB_API_KEY,
  SUPA_DB_URL,
  STRIPE_SECRET,
  CLIENT_URL,
  PRODUCT_ID,
  WEBHOOK_KEY,
  PROJECT_ID,
  PRIVATE_KEY_ID,
  PRIVATE_KEY,
  CLIENT_EMAIL,
  CLIENT_ID,
  AUTH_URI,
  TOKEN_URI,
  AUTH_PROVIDE_X509_CERT_URL,
  CLIENT_X509_CERT_URL,
  SPREADSHEET_ID,
  SCOPES,
};

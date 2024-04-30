require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_KEY;
const PORT = process.env.PORT;
const SUPA_DB_URL = process.env.SUPA_DB_URI;
const SUPA_DB_API_KEY = process.env.SUPA_DB_API_KEY;
const STRIPE_SECRET = process.env.STRIPE_SECRET;
const CLIENT_URL = process.env.CLIENT_URL;
const PRODUCT_ID = process.env.PRODUCT_ID;
module.exports = {
  JWT_SECRET_KEY,
  PORT,
  SUPA_DB_API_KEY,
  SUPA_DB_URL,
  STRIPE_SECRET,
  CLIENT_URL,
  PRODUCT_ID,
};

require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_KEY;
const PORT = process.env.PORT || 3000;
const SUPA_DB_URL = process.env.SUPA_DB_URI;
const SUPA_DB_API_KEY = process.env.SUPA_DB_API_KEY;
module.exports = {
  JWT_SECRET_KEY,
  PORT,
  SUPA_DB_API_KEY,
  SUPA_DB_URL,
};

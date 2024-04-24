require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_KEY;
const PORT = process.env.PORT || 3000;
const MONGO_DB_URL = process.env.MONGO_DB_URI;

module.exports = { JWT_SECRET_KEY, PORT, MONGO_DB_URL };

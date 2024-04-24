const mongoose = require("mongoose");
const { MONGO_DB_URL } = require("../config/config");
async function connectDb() {
  try {
    await mongoose.connect(MONGO_DB_URL);
    console.log("Database connected successfully!");
  } catch (error) {
    console.log(error);
  }
}

module.exports = connectDb;

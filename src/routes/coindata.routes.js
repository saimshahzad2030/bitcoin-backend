const express = require("express");
const { verifyUser } = require("../middleware/jwt");

const {
  fetchData,
  fetchsingleCoinController,
} = require("../controller/coindata.controller");
const coindataroutes = express.Router();

coindataroutes.route("/fetchdata").get(verifyUser, fetchData);
coindataroutes
  .route("/fetchSingleCoin")
  .get(verifyUser, fetchsingleCoinController);

module.exports = coindataroutes;

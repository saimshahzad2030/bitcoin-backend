const express = require("express");
const {
  subscribeController,
  fetchRemainingTime,
} = require("../controller/payment.controller");
const { verifyUser } = require("../middleware/jwt");
const paymentRoutes = express.Router();

paymentRoutes.route("/subscribe").post(verifyUser, subscribeController);
paymentRoutes.route("/fetchRemainingTime").get(verifyUser, fetchRemainingTime);
module.exports = paymentRoutes;

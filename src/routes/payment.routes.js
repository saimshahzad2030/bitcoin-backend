const express = require("express");
const { subscribeController } = require("../controller/payment.controller");

const paymentRoutes = express.Router();

paymentRoutes.route("/subscribe").post(subscribeController);
module.exports = paymentRoutes;

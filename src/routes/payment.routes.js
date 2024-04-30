const express = require("express");
const { subscribeController } = require("../controller/payment.controller");
const { verifyUser } = require("../middleware/jwt");
const paymentRoutes = express.Router();

paymentRoutes.route("/subscribe").post(verifyUser, subscribeController);
module.exports = paymentRoutes;

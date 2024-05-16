const express = require("express");

const {
  verificationEmailController,
  changePassVerificationEmailController,
} = require("../controller/email.controller");

const emailRoutes = express.Router();

emailRoutes.route("/verificationemail").post(verificationEmailController);
emailRoutes
  .route("/PassVerificationController")
  .post(changePassVerificationEmailController);

module.exports = emailRoutes;

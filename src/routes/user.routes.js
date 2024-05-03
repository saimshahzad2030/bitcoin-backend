const { signup, login, adminReset } = require("../controller/user.controller");
const jwt = require("../middleware/jwt");
const express = require("express");

const userRoutes = express.Router();

userRoutes.route("/login").post(login);

userRoutes.route("/signup").post(signup);
userRoutes.route("/adminreset").post(jwt.verifyAdmin, adminReset);

userRoutes.route("/authenticate").get(jwt.authGuard);

module.exports = userRoutes;

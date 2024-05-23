const {
  signup,
  login,
  adminReset,
  forgetPasswordController,
  updatePasswordController,
  updateNameController,
  fetchUserDetails,
} = require("../controller/user.controller");
const jwt = require("../middleware/jwt");
const express = require("express");

const userRoutes = express.Router();

userRoutes.route("/login").post(login);

userRoutes.route("/signup").post(signup);
userRoutes.route("/changePassword").patch(forgetPasswordController);
userRoutes.route("/updateName").patch(updateNameController);
userRoutes.route("/adminreset").post(jwt.verifyAdmin, adminReset);
userRoutes.route("/updatePass").patch(updatePasswordController);
userRoutes.route("/fetchUser").get(jwt.verifyUser, fetchUserDetails);

userRoutes.route("/authenticate").get(jwt.authGuard);

module.exports = userRoutes;

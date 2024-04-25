const express = require("express");

const {
  fetchFoodsApi,
  addJuiceApi,
} = require("../controller/foods.controller");

const foodRoutes = express.Router();

foodRoutes.route("/foods").get(fetchFoodsApi);
foodRoutes.route("/foods").post(addJuiceApi);

module.exports = foodRoutes;

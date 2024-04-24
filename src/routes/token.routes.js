const express = require('express');
const { matchToken } = require('../controller/token.controller');

const tokenRoutes = express.Router()

tokenRoutes
    .route('/match-token')
  .post(matchToken)
 


module.exports = tokenRoutes;
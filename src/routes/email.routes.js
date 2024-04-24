const express = require('express')

const verificationEmailController = require('../controller/email.controller')




const emailRoutes = express.Router()

emailRoutes
    .route('/verificationemail')
  .post(verificationEmailController)
 


module.exports = emailRoutes;
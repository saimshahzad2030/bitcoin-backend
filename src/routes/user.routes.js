
const {signup,login} = require('../controller/user.controller');
const jwt = require('../middleware/jwt')
const {countEverything} = require('../services/all-entries')
const express = require('express')

const userRoutes = express.Router()

userRoutes
    .route('/login')
    .post(login)

userRoutes
    .route('/signup')
    .post(signup)

userRoutes
    .route('/authenticate')
    .get(jwt.authGuard)

userRoutes
    .route('/count')
    .get(jwt.verifyAdmin,countEverything)



module.exports = userRoutes;
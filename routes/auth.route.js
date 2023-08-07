const express = require('express')
const { login, register, currentUser } = require('../controllers/auth.controller')
const { authJWT } = require('../middlewares/auth.middleware')
const AuthRouter = express.Router()

AuthRouter.post('/login', login)
AuthRouter.post('/register', register)
AuthRouter.get('/currentUser', authJWT, currentUser)

module.exports = AuthRouter
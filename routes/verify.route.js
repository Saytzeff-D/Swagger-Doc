const express = require('express')
const { verifyEmailCode, verifySmsCode } = require('../controllers/verify.controller')
const VerifyRouter = express.Router()

VerifyRouter.post('/sms/:userId', verifySmsCode)
VerifyRouter.post('/email/:userId', verifyEmailCode)

module.exports =  VerifyRouter
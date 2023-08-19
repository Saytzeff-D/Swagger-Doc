const express = require('express')
const { verifySmsCode, sendPasswordResetCode, verifyEmailCodeForReset } = require('../controllers/verify.controller')
const VerifyRouter = express.Router()

VerifyRouter.post('/sms/:userId', verifySmsCode)
VerifyRouter.post('/reset-email', sendPasswordResetCode)
VerifyRouter.post('/verify-reset-code', verifyEmailCodeForReset)

module.exports =  VerifyRouter
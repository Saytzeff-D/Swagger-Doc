const express = require('express')
const { verifySmsCode, sendPasswordResetCode, verifyEmailCodeForReset, resetPassword } = require('../controllers/verify.controller')
const { resetToken } = require('../middlewares/reset.middleware')
const VerifyRouter = express.Router()

VerifyRouter.post('/sms/:userId', verifySmsCode)
VerifyRouter.post('/forgot-password', sendPasswordResetCode)
VerifyRouter.post('/verify-reset-code', verifyEmailCodeForReset)
VerifyRouter.put('/reset-password', resetToken, resetPassword)

module.exports =  VerifyRouter
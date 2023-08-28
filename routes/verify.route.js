const express = require('express')
const { resetToken } = require('../middlewares/reset.middleware')
const { verifySmsCode } = require('../controllers/sms.controller')
const { sendOtpCode, verifyOtpCode, resetPassword } = require('../controllers/reset-password.controller')
const VerifyRouter = express.Router()

VerifyRouter.post('/sms/:userId', verifySmsCode)
VerifyRouter.post('/forgot-password', sendOtpCode)
VerifyRouter.post('/verify-otp-code', verifyOtpCode)
VerifyRouter.put('/reset-password', resetToken, resetPassword)

module.exports =  VerifyRouter
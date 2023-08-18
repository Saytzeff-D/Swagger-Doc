const express = require('express')
const { sendSMS, verifyEmail } = require('../controllers/verify.controller')
const VerifyRouter = express.Router()

VerifyRouter.get('/sms', sendSMS)
VerifyRouter.post('/email', verifyEmail)

module.exports =  VerifyRouter
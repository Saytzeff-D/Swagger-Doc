const express = require('express')
const { sendSMS } = require('../controllers/verify.controller')
const VerifyRouter = express.Router()

VerifyRouter.get('/sms', sendSMS)

module.exports =  VerifyRouter
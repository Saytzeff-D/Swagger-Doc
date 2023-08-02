const express = require('express')
const { createTables } = require('../controllers/seed.controller')
const SeedRouter = express.Router()

SeedRouter.post('/tables', createTables)

module.exports = SeedRouter
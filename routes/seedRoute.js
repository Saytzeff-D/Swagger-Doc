const express = require('express')
const { createTables, dropAll } = require('../controllers/seed.controller')
const SeedRouter = express.Router()

SeedRouter.post('/tables', createTables)
SeedRouter.post('/drop', dropAll)

module.exports = SeedRouter
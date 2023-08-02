const ServiceRouter = require('express').Router()
const { getService, allCountryServices } = require('../controllers/service.controller')

ServiceRouter.post('/:serviceId', getService)
ServiceRouter.get('/country/:countryId', allCountryServices)

module.exports = ServiceRouter
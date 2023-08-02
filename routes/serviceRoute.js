const ServiceRouter = require('express').Router()
const { isAdmin, isAuth } = require('../middlewares/authMiddleware')
const { getService, allCountryServices, createService } = require('../controllers/service.controller')

ServiceRouter.post('/', isAuth, isAdmin, createService)
ServiceRouter.get('/:serviceId', getService)
ServiceRouter.get('/country/:countryId', allCountryServices)

module.exports = ServiceRouter
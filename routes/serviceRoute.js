const ServiceRouter = require('express').Router()
const { isAdmin, isAuth } = require('../middlewares/authMiddleware')
const { getService, allCountryServices, createService, editService, deleteService } = require('../controllers/service.controller')

ServiceRouter.post('/', isAuth, isAdmin, createService)
ServiceRouter.get('/:serviceId', getService)
ServiceRouter.put('/:serviceId', editService)
ServiceRouter.delete('/:serviceId', deleteService)
ServiceRouter.get('/country/:countryId', allCountryServices)

module.exports = ServiceRouter
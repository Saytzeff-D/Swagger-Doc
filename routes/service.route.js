const ServiceRouter = require('express').Router()
const { isAdmin, isAuth } = require('../middlewares/authMiddleware')
const { getService, allChapterServices, createService, editService, deleteService } = require('../controllers/service.controller')

ServiceRouter.post('/', isAuth, isAdmin, createService)
ServiceRouter.get('/:serviceId', getService)
ServiceRouter.put('/:serviceId', editService)
ServiceRouter.delete('/:serviceId', deleteService)
ServiceRouter.get('/chapter/:chapterId', allChapterServices)

module.exports = ServiceRouter
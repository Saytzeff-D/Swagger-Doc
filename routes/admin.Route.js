const AdminRouter = require("express").Router()
const { isAuth, isAdmin } = require("../middlewares/auth.middleware")
const { allNotifications } = require("../controllers/notification.controller")

AdminRouter.get('/notifications', allNotifications);



module.exports = AdminRouter
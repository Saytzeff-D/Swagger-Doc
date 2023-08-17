const AdminRouter = require("express").Router()
const { isAuth, isAdmin } = require("../middlewares/auth.middleware")
const { allNotifications, getAllUsers, deleteUser } = require("../controllers/admin.controller")

AdminRouter.get('/users', getAllUsers);
AdminRouter.delete('user/:userId', deleteUser)
AdminRouter.get('/notifications', allNotifications);


module.exports = AdminRouter
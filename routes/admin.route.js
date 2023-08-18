const AdminRouter = require("express").Router()
const { isAuth, isAdmin } = require("../middlewares/auth.middleware")
const { allNotifications, getAllUsers, deleteUser, getTransactionNotifications, getNewUserNotifications, getDocumentNotifications, addAdmin } = require("../controllers/admin.controller")

AdminRouter.get('/users', getAllUsers);
AdminRouter.delete('/user/:userId', deleteUser);
AdminRouter.get('/notifications', allNotifications);
AdminRouter.get('/notifications/transactions', getTransactionNotifications);
AdminRouter.get('/notifications/users', getNewUserNotifications);
AdminRouter.get('/notifications/documents', getDocumentNotifications);
AdminRouter.post('/add-admin/:userId', addAdmin);


module.exports = AdminRouter
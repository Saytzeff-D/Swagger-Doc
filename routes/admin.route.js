const AdminRouter = require("express").Router()
const { isAuth, isAdmin } = require("../middlewares/auth.middleware")
const { allNotifications, getAllUsers, deleteUser, getTransactionNotifications, getNewUserNotifications, getDocumentNotifications, addAdmin, adminLogin } = require("../controllers/admin.controller")

AdminRouter.get('/users', isAuth, isAdmin, getAllUsers);
AdminRouter.delete('/user/:userId', isAuth, isAdmin, deleteUser);
AdminRouter.get('/notifications', isAuth, isAdmin, allNotifications);
AdminRouter.get('/notifications/transactions', isAuth, isAdmin, getTransactionNotifications);
AdminRouter.get('/notifications/users', isAuth, isAdmin, getNewUserNotifications);
AdminRouter.get('/notifications/documents', isAuth, isAdmin, getDocumentNotifications);
AdminRouter.post('/add-admin/:userId', isAuth, isAdmin, addAdmin);
AdminRouter.post('/login', adminLogin);



module.exports = AdminRouter
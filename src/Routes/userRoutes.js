const express = require("express")
const Router = express.Router()
const userController = require("../Controller/userController")
const {auth, isAdmin } = require("../Middleware/Auth")

Router.post('/register-user', userController.Register)
Router.post('/login-user', userController.Login)
Router.post('/forgot-password', userController.forgotPassword)
Router.post('/reset-password/:email', userController.resetPassword)
Router.get('/get-all', auth, isAdmin, userController.AllUser)
Router.put('/user-update/:customer_id',auth, isAdmin, userController.UpdateUser)
module.exports = Router;
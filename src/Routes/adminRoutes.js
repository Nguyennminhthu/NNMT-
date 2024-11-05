const express = require("express")
const Router = express.Router()
const adminController = require("../Controller/adminController")

Router.post('/register-admin', adminController.Register)
Router.post('/login-admin', adminController.Login)

module.exports = Router;
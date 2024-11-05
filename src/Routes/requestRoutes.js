const express = require("express")
const Router = express.Router()
const requestController = require("../Controller/requestController")
const { auth, isAdmin } = require('../Middleware/Auth');


Router.post('/create-request', auth, requestController.createSupport)
Router.get('/get-request', auth, isAdmin, requestController.getRequest)


module.exports = Router;
const express = require("express")
const Router = express.Router()
const billController = require("../Controller/billController");
const { auth, isAdmin } = require("../Middleware/Auth")

Router.post('/create-bill', auth,isAdmin, billController.createBill)
Router.get('/get-bill', auth, isAdmin, billController.getBill)
Router.put('/update-bill/:id', isAdmin, auth, billController.updateBill)
Router.delete('/create-bill/:id', auth,isAdmin, billController.deleteBill)

module.exports = Router;
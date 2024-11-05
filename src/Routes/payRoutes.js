const express = require("express")
const Router = express.Router()
const {auth} = require("../Middleware/Auth")
const payController = require("../Controller/payController")

Router.post('/create-pay/:bill_id',auth, payController.CreatePay)
Router.post('/callback',auth, payController.callback);
Router.put('/transaction-status/:app_trans_id',auth, payController.transactionStatus);
Router.post('/transactions-refund/:bill_id',auth, payController.transRefund);
Router.post('/queryRefund',auth, payController.queryRefund);

module.exports = Router
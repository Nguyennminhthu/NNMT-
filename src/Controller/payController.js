const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const moment = require('moment');
const CryptoJS = require('crypto-js');
const qs = require('qs');
dotenv.config();
const Pay = require("../Model/payModel")
const Bill = require("../Model/billModel")

const config = {
    app_id: process.env.ZALOPAY_APP_ID,
    key1: process.env.ZALOPAY_KEY1,
    key2: process.env.ZALOPAY_KEY2,
    endpoint: process.env.ZALOPAY_ENDPOINT,
    refund_url: process.env.ZALOPAPY_REFUNDURL,
    query_refund: process.env.ZALOPAY_QUERYREFUND
};
const CreatePay = async (req, res) => {
    const bill_id = req.params.bill_id;
    const amount = await Pay.getAmount(bill_id)
    const description = req.body.description;
    const embed_data = {
        redirecturl: `/api/payments`,
    };

    const items = [];
    const transID = Math.floor(Math.random() * 1000000);

    const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
        app_user: req.user.customer_id,
        app_time: Date.now(),
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: amount,
        callback_url: `${process.env.LINK_NGROK}/api/payments/callback`,
        description: description,
        bank_code: '',
    };
    const data = `${config.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
        await Pay.create(order.app_trans_id, order.amount, 'pending', description, order.app_user, bill_id);

        const result = await axios.post(config.endpoint, null, { params: order });
        return res.status(200).json(result.data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Có lỗi xảy ra' });
    }
}
const callback = async (req, res) => {
    const configCallback = {
        key2: "eG4r0GcoNtRGbO8"
    }
    const result = {};
    try {
        const dataStr = req.body.data;
        const reqMac = req.body.mac;

        const mac = CryptoJS.HmacSHA256(dataStr, configCallback.key2).toString();
        if (reqMac !== mac) {
            result.return_code = -1;
            result.return_message = 'mac not equal';
        } else {
            const dataJson = JSON.parse(dataStr);
            const app_trans_id = dataJson['app_trans_id'];
            const status = dataJson['status'];

            if (status === 'success') {
                await Pay.updateStatus(app_trans_id, 'Completed');
                result.return_code = 1;
                result.return_message = 'success';
            } else {
                await Pay.updateStatus(app_trans_id, 'Failed');
                result.return_code = 0;
                result.return_message = 'Failed';
            }
        }
    } catch (ex) {
        console.log('Lỗi xử lý callback:', ex.message);
        result.return_code = 0;
        result.return_message = 'Có lỗi xảy ra';
    }

    res.json(result);
};
const transactionStatus = async (req, res) => {
    const app_trans_id = req.params.app_trans_id;
    const postData = {
        app_id: config.app_id,
        app_trans_id,
    };

    const data = `${postData.app_id}|${postData.app_trans_id}|${config.key1}`;
    postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
    const postConfig = {
        method: 'post',
        url: 'https://sb-openapi.zalopay.vn/v2/query',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify(postData),
    };

    try {
        const result = await axios(postConfig);
        const paymentData = result.data;
        if (paymentData.return_code === 1) {
            await Pay.updateStatus(app_trans_id, 'completed');
            const bill_id = await Bill.getBillIdFromPayment(app_trans_id);
            console.log(bill_id)
            if (bill_id) {
                await Bill.updateBillStatus('paid', bill_id);
            } else {
                console.log('Bill ID not found for transaction:', app_trans_id);
            }
        } else {
            await Pay.updateStatus(app_trans_id, 'failed');
        }

        return res.status(200).json(paymentData);
    } catch (error) {
        console.log('Lỗi:', error);
        return res.status(500).json({ message: 'Có lỗi xảy ra' });
    }
};
const transRefund = async (req, res) => {
    const bill_id = req.params.bill_id;
    const { zp_trans_id, amount } = req.body;
    const timestamp = Date.now();
    const uid = `${timestamp}${Math.floor(111 + Math.random() * 999)}`;
  
    let params = {
      app_id: config.app_id,
      m_refund_id: `${moment().format('YYMMDD')}_${config.app_id}_${uid}`,
      timestamp: timestamp,
      zp_trans_id: zp_trans_id,
      amount: amount,
      description: 'ZaloPay Refund TEST DAT',
    };
    console.log(params);
    let data = `${params.app_id}|${params.zp_trans_id}|${params.amount}|${params.description}|${params.timestamp}`;
    params.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
  
    try {
      await Pay.refundID( params.m_refund_id, bill_id)
      const refundResult = await axios.post(config.refund_url, params, {
        headers: {
          method: 'post',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return res.status(200).json(refundResult.data);
    } catch (error) {
      console.error('Error refunding transaction:', error);
      return res.status(500).json({ message: 'Lỗi khi gửi yêu cầu hoàn trả', error: error.message });
    }
  };
const queryRefund = async (req, res) => {
    const { Refer_refund_id } = req.body;

  const params = {
    app_id: config.app_id,
    timestamp: Date.now(),
    m_refund_id: Refer_refund_id,
  };
  const data = `${config.app_id}|${params.m_refund_id}|${params.timestamp}`; 
  params.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
  try {
    const queryResult = await axios.post(config.query_refund, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    });
    return res.status(200).json(queryResult.data);
  } catch (error) {
    console.error('Error querying refund status:', error);
    return res.status(500).json({ message: 'Lỗi khi gửi yêu cầu truy vấn hoàn tiền', error: error.message });
  }
}
module.exports = {
    CreatePay,
    callback,
    transactionStatus,
    queryRefund,
    transRefund
}
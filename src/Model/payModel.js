const db = require('../config/Data');

const Payment = {
  //[CREATE ]
  create: async (app_trans_id, amount, status, message, app_user, bill_id) => {
    const query = 'INSERT INTO payments (app_trans_id, payment_amount, payment_status, message, customer_id, bill_id) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [app_trans_id, amount, status, message, app_user, bill_id];
    return db.query(query, values);
  },
  getAmount: async (bill_id) => {
    const query = 'SELECT bill_amount FROM bills WHERE bill_id = ?';
    const [rows] = await db.query(query, [bill_id]);
    return parseFloat(rows[0].bill_amount);
},
  //[UPDATE ]
  updateStatus: async (app_trans_id, status) => {
    const query = 'UPDATE payments SET payment_status = ? WHERE app_trans_id = ?';
    const values = [status, app_trans_id];
    return db.query(query, values);
  },
  //[GETID TRANSACTION]
  getByTransId: async (app_trans_id) => {
    const query = 'SELECT * FROM payments WHERE app_trans_id = ?';
    const [rows] = await db.query(query, [app_trans_id]);
    return rows[0];
  },
  refundID: async ( m_refund_id, bill_id) => {
    const query = 'UPDATE payments SET refund_id = ? WHERE bill_id = ?';
    const value = [m_refund_id, bill_id];
    return db.query(query, value)

  }

};

module.exports = Payment;
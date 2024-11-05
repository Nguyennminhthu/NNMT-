const db = require("../config/Data");
const { updateStatus } = require("./payModel");

const Bill = {
    createBill: async (customer_id, bill_amount, due_date, payment_status) => {
        const query = 'INSERT INTO bills (customer_id, bill_amount, due_date, payment_status) VALUES (?, ?, ?, ?)'
        const value = [customer_id, bill_amount, due_date, payment_status];
        return db.query(query, value)
    },
    getBillIdFromPayment: async (app_trans_id) => {
        const query = 'SELECT bill_id FROM payments WHERE app_trans_id = ?';
        const [rows] = await db.query(query, [app_trans_id]);
        return parseFloat(rows[0].bill_id);
    },
    updateBillStatus: async (payment_status, bill_id) => {
        const query = 'UPDATE bills SET payment_status = ? WHERE bill_id = ?';
        const values = [payment_status, bill_id];
        return db.query(query, values);
    },    
    getBill: async () => {
        const query = 'SELECT * FROM bills'
        const [rows] = await db.query(query);
        return rows;
    }
}
module.exports = Bill;
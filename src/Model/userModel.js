const db = require("../config/Data");
const { getAllUser } = require("../Controller/userController");

const User = {
    findByEmail: async (email) => {
        const query = 'SELECT * FROM customers WHERE email = ?';
        const [rows] = await db.query(query, [email]);
        return rows[0];
    },
    findById: async (customer_id) => {
        const query = 'SELECT * FROM customers WHERE customer_id = ?';
        const [rows] = await db.query(query, [customer_id]);
        return rows[0];
    },
    createUser: async (full_name, email, passrowd, phone_number, address) => {
        const query = 'INSERT INTO customers (full_name, email, password, phone_number, address) VALUES (?, ?, ?, ?, ?)'
        const value = [full_name, email, passrowd, phone_number, address];
        return db.query(query, value)
    },
    updatepass: async (email, hashedPassword) => {
        return await db.query('UPDATE customers SET password = ? WHERE email = ?', [hashedPassword, email]);
    },
    getAll: async () => {
        const query = 'SELECT full_name, phone_number, email, address FROM customers';
        const [rows] = await db.query(query);
        return rows;
    },
    UserUpdate: async (customer_id, full_name, phone_number, email, address) => {
        const query = `UPDATE customers SET full_name = ?, phone_number = ?, email = ?, address = ? WHERE customer_id = ?`;
        const [result] = await db.query(query, [full_name, phone_number, email, address, customer_id]);
        return result;
    },
}
module.exports = User
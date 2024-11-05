const db = require('../config/Data')
const Support = {
    CreateSupport: async (customer_id, request_type = 'maintenance', request_description, status = 'pending') => {
        const query = `INSERT INTO requests (customer_id, request_type, request_description, request_status) VALUES (?, ?, ?, ?)`;
        const [result] = await db.query(query, [customer_id, request_type, request_description, status]);
        return result;
    },
    AllSupport: async() =>{
        const query = `SELECT * FROM requests`
        const [result] = await db.query(query)
        return result;
    }
}
module.exports = Support;
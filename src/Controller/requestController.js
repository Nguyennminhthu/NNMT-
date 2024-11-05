const request = require('../Model/requestModel')
const auth = require('../Middleware/Auth');


const createSupport = async (req, res) => {
    const { request_type, request_description } = req.body;
    const customer_id = req.user.customer_id;
    try {
        const result = await request.CreateSupport(customer_id, request_type, request_description, 'pending');
        res.status(201).json({ id: result.insertId, customer_id, request_type, request_description });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getRequest = async (req, res) => {
    try {
        const supportRequests = await request.AllSupport();
        if (supportRequests.length === 0) {
            return res.status(404).json({ message: 'No requests found' });
        }
        res.status(200).json(supportRequests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
module.exports = {
    createSupport,
    getRequest
}
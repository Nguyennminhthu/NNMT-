const Bill = require("../Model/billModel")
const User = require("../Model/userModel")

const createBill = async (req, res) => {
    //yyyy/mm/dd
    const {customer_id, bill_amount, due_date, payment_status} = req.body;
    try {
        const checkUser = await User.findById(customer_id);
        if (checkUser) {
            await Bill.createBill(customer_id,bill_amount, due_date, payment_status)
            res.status(201).json({ message: 'Bill registered successfully' });
        }
        else {
            res.status(500).json({message: 'Account not found'})
        }
        
    } catch (error) {
        console.error('Error registering bill:', error);
        res.status(500).json({ message: 'Error registering bill' });
    }
}
const getBill = async (req, res) => {
    try {
        const getAllBill = await Bill.getBill();
        if (getAllBill.length === 0) {
          return res.status(404).json({ message: 'NONE' });
        }
        return res.status(200).json({ getAllBill });
      } catch (error) {
        console.log('Error fetching bill:', error);
        return res.status(500).json({ message: 'FAIL' });
      }
}

const updateBill= async (req, res) => {

}

const deleteBill = async (req, res) => {

}

module.exports = {
    createBill,
    getBill,
    updateBill,
    deleteBill
}
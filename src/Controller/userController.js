const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const User = require('../Model/userModel');
const Auth = require('../Middleware/Auth');
const Email = require("../Service/emailService")

dotenv.config();

const Register = async (req, res) => {
    const { full_name, email, password, phone_number, address } = req.body;
    try {
        const checkUser = await User.findByEmail(email);
        if (checkUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        await User.createUser(full_name, email, hashPassword, phone_number, address);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
};

const Login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        //Trả về thông tin User
        const userPayload = {
            customer_id: user.customer_id,
            full_name: user.full_name,
            email: user.email,
            phone_number: user.phone_number,
            address: user.address
        };
        const token = Auth.generateAccessToken(userPayload);
        res.status(200).json({ message: 'Login successful', token, user: userPayload });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
};
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findByEmail(email)
        if (!user) {
            return res.status(400).json({ message: 'Account not found' })
        }
        await Email.forgotPasswordMail(user)

    } catch (error) {
        console.error('Error forgot in:', error);
        res.status(500).json({ message: 'Error forgot in' });
    }
}
const resetPassword = async (req, res) => {
    const { newPassword } = req.body;
    try {
        const user = await User.findByEmail(req.params.email)
        if (!user) {
            return res.status(404).json({ error: "Người dùng không tồn tại" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.updatepass(req.params.email, hashedPassword)
        res.status(200).json({ msg: "Mật khẩu đã được cập nhật thành công" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}
const AllUser = async (req, res) => {
    try {
        const getUser = await User.getAll();
        res.status(200).json({ message: getUser });

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}
const UpdateUser = async (req, res) => {
    try {
        const { customer_id } = req.params; // hoặc lấy từ req.body tùy cách bạn định nghĩa API
        const { full_name, phone_number, email, address } = req.body;
        const result = await User.findById(customer_id)
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        await User.UserUpdate(customer_id, full_name, phone_number, email, address)
        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred", error });
    }
};

module.exports = {
    Register,
    Login,
    forgotPassword,
    resetPassword,
    AllUser,
    UpdateUser
};

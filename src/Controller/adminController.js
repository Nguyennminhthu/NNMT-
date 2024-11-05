const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const Admin = require('../Model/adminModel');
const Auth = require('../Middleware/Auth');

dotenv.config();

const Register = async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        const checkAmin = await Admin.findByEmail(email);
        if (checkAmin) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        await Admin.createAdmin(username, email, hashPassword, role);
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering admin' });
    }
};

const Login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    try {
        const admin = await Admin.findByEmail(email);
        if (!admin) {
            return res.status(400).json({ message: 'Admin not found' });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        //Trả về thông tin Admin
        const userPayload = {
            id: admin.id,
            username: admin.username,
            email: admin.email,
            role: admin.role,
        };
        const token = Auth.generateAccessToken(userPayload);
        res.status(200).json({ message: 'Login successful', token, admin: userPayload });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
};
module.exports = {
    Register,
    Login,
};

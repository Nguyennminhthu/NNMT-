const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();


const generateAccessToken = (userPayload) => {
    return jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            customer_id: decoded.customer_id,
            email: decoded.email,
            full_name: decoded.full_name,
            address: decoded.address,
            phone: decoded.phone_number,
            role: decoded.role
        };
        next();
    } catch (error) {
        const errorMsg = error.name === 'TokenExpiredError'
            ? 'Token expired, please login again'
            : 'Token is not valid';
        return res.status(401).json({ message: errorMsg });
    }
};
const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
  
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied, you are not an admin' });
    }
  
    next(); 
};


module.exports = {
    generateAccessToken,
    auth,
    isAdmin
};

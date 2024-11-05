const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment
dotenv.config();

const userRoute = require("./Routes/userRoutes");
const adminRoute = require("./Routes/adminRoutes");
const requestRoute = require("./Routes/requestRoutes");
const billRoute = require("./Routes/billRoutes");
const payRoute = require("./Routes/payRoutes");
const forumPost = require("./Routes/forumPostRoutes");
const forumComment = require("./Routes/forumCommentRoutes");

const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(express.json());

// CORS Configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.use('/api/user', userRoute);
app.use('/api/admin', adminRoute);
app.use('/api/request', requestRoute);
app.use('/api/bill', billRoute);
app.use('/api/payments', payRoute);
app.use('/api/forum/post', forumPost);
app.use('/api/forum/comment', forumComment);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something went wrong!' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

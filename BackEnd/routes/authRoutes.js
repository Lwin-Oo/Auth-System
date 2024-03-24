// authRoutes.js

const express = require('express');
const router = express.Router();
const { register, login, getUserByEmail, sendPasswordResetEmail   } = require('../controllers/authController');
const authenticateToken = require('../constants/authMiddleware')
// Our Services
const invoiceRouter = require('../../../Invoice-app-native-2.0-master/App/BackEnd/routes/invoiceRoutes');

router.post('/register', register);
router.post('/login', login);
router.get('/user/:email', authenticateToken, getUserByEmail); // Add this route to handle GET requests for retrieving user by email
//router.post('/forgot-password', sendPasswordResetEmail)

// Mount the invoice routes
router.use('/invoices', invoiceRouter);
module.exports = router;

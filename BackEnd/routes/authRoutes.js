// authRoutes.js

const express = require('express');
const router = express.Router();
const { register, login, getUserByEmail } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/user/:email', getUserByEmail); // Add this route to handle GET requests for retrieving user by email

module.exports = router;

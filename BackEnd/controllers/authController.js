// authController.js

// Implementating functionalities for LogIn, Register and LogOut

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { secretKey } = require('../config/keys');


// Register
exports.register = async (req, res) => {
  try {
    const { email, password, businessName, businessPhoneNumber, streetAddress, city, state, postalCode, country } = req.body;

    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // If the email already exists, return an error response
      return res.status(400).json({ error: 'Email already exists' });
    }

    // If the email doesn't exist, proceed with user registration
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ 
      email, 
      password: hashedPassword, 
      businessName, 
      businessPhoneNumber, 
      
      streetAddress,
      city,
      state,
      postalCode,
      country
      
    });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

  


// Login
exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find user with email entered
      const user = await User.findOne({ email });
  
      // Check if user with that email address actually exists in the database
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      // Compare the password entered by the user with the hashed password stored in the database
      const validPassword = await bcrypt.compare(password, user.password);
  
      if (!validPassword) {
        // If the password doesn't match, return an error
        return res.status(401).json({ error: 'Incorrect password' });
      }
  
      // If the password matches, generate a token and send it in the response
      const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};
  

exports.getUserByEmail = async (req, res) => {
    try {
      const { email } = req.params;
      const user = await User.findOne({ email });
  
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

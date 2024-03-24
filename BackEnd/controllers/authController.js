// authController.js


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { secretKey } = require('../config/keys');
const uuid = require('uuid');
const nodemailer = require('nodemailer');


//Our Services
const Invoice = require('../../../Invoice-app-native-2.0-master/App/BackEnd/models/invoiceModel');

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
      country,
      invoices: [] // Initialize invoices array for each user
      
    });
    await user.save();

    // Generate verification token
    const verificationToken = generateVerificationToken();

    // Send verification link
    sendVerificationEmail(email, verificationToken);

    res.status(201).json({ message: 'User registered successfully', verificationToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to generate a verification token
const generateVerificationToken = () => {
  return uuid.v4(); // Generate a unique verification token
};

// Function to send a verification email
const sendVerificationEmail = (email, verificationToken) => {
  // Create a Nodemailer transporter using SMTP or other email service configuration
  const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'info@usataxes.net', // Your Outlook email address
      pass: 'your_password', // Your email password or app-specific password
    },
  });

  // Craft the email content
  const mailOptions = {
    from: 'info@usataxes.net', // Sender address
    to: email, // Recipient address
    subject: 'Verification Email', // Email subject
    text: `Click the following link to verify your email: http://yourapp.com/verify?token=${verificationToken}`, // Plain text body
    html: `<p>Click the following link to verify your email: <a href="http://yourapp.com/verify?token=${verificationToken}">Verify Email</a></p>`, // HTML body
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending verification email:', error);
    } else {
      console.log('Verification email sent:', info.response);
    }
  });
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

    // If the password matches, generate a token with user ID included in the payload
    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });

    // Return the token along with any other necessary data
    res.json({ token, userId: user._id });
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

// Request Password Reset
exports.requestPasswordReset = async ( req, res ) => {
  try{
    const { email } = req.body;
    const user = await User.findOne({ email });

    if(!user) {
      return res.status(404).json({ error: 'User not found '});
    }

    const resetToken = generateResetToken();
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    sendPasswordResetEmail(email, resetToken);
    res.status(200).json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error('Error requesting password reset: ', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Verify Reset Token
exports.verifyResetToken = async ( req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    const user = await User.findOne({ resetToken: token });

    if( !user || user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ error: ' Invalid or expired reset token' });
    }

    user.password = newPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.status(200).json({ message: ' Password reset successfully' });
  } catch (error) {
    console.error( 'Error resetting password: ', error);
    res.status(500).json({ error: ' Internal Server error' });
  }
};

// Helper function to generate a random reset token
const generateResetToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Helper function to send password reset email
const sendPasswordResetEmail = async (email, token) => {
  try {
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      // Configure SMTP settings for Outlook
      host: 'smtp.office365.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'info@usataxes.net', // company's email address
        pass: 'password', // email password or app-specific password
      },
    });

    // Craft the email content
    const mailOptions = {
      from: 'info@usataxes.net', // Sender address
      to: email, // Recipient address
      subject: 'Password Reset Request', // Email subject
      html: `<p>You have requested a password reset. Click the following link to reset your password:</p>
             <a href="http://app.com/reset-password?token=${token}">Reset Password</a>`, // HTML body with password reset link
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully.');
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Error sending password reset email');
  }
};





const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const User = require('../models/user');
const { secretKey } = require('../config/keys');
const uuid = require('uuid');

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

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
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

    // If the password matches, generate a token with user ID included in the payload
    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });

    // Return the token along with any other necessary data
    res.json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get User By Email
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
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate a TOTP secret
    const secret = speakeasy.generateSecret({ length: 20 });

    // Save the TOTP secret in the user's record
    user.totpSecret = secret.base32;
    await user.save();

    console.log(`TOTP Secret for ${email}: ${secret.base32}`);

    // Generate a QR code for the TOTP setup
    const otpauthUrl = speakeasy.otpauthURL({
      secret: secret.base32,
      label: `AuthUSAT (${email})`,
      issuer: 'USATaxes.Net',
      encoding: 'base32'
    });

    // Generate the QR code image
    qrcode.toDataURL(otpauthUrl, (err, data_url) => {
      if (err) {
        return res.status(500).json({ message: 'Error generating QR code' });
      }

      // Send the QR code image URL to the client
      res.json({ qrCodeUrl: data_url });
    });

  } catch (error) {
    console.error('Error requesting password reset:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.verifyResetToken = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`Received data - Email: ${email}, Token: ${token}, New Password: ${newPassword}`);
    console.log(`TOTP Secret for ${email}: ${user.totpSecret}`);

    const verified = speakeasy.totp.verify({
      secret: user.totpSecret,
      encoding: 'base32',
      token: token,
      window: 2 // Adjust the window size if necessary
    });

    console.log(`TOTP Verification Result: ${verified}`);

    if (!verified) {
      console.log('TOTP verification failed');
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Hash the new password and save it
    user.password = await bcrypt.hash(newPassword, 10);
    user.totpSecret = null; // Clear the TOTP secret after successful password reset
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Helper function to generate a verification token
const generateVerificationToken = () => {
  return uuid.v4(); // Generate a unique verification token
};

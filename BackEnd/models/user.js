// models/user.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  businessName: { type: String },
  businessPhoneNumber: { type: String },
  streetAddress: { type: String },
  city: { type: String },
  state: { type: String },
  postalCode: { type: String },
  country: { type: String },
  invoices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' }],
  totpSecret: { type: String } // Add the TOTP secret field
});

const User = mongoose.model('User', userSchema);
module.exports = User;

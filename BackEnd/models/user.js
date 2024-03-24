// user.js

// Defining User schema
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    businessName: { type: String, required: true },
    businessPhoneNumber: { type: String, required: true },
    streetAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },

    // Services

    //1. Invoices
    invoices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' }] // Reference to invoices
    
});

module.exports = mongoose.model('User', userSchema);


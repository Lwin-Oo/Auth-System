// user.js

// Defining User schema

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // more fields will come here
});

module.exports = mongoose.model('User', userSchema);

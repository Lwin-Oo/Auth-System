// app.js

const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = 'mongodb+srv://lpaing0019:Leoforlight1898@auth.a56tmrv.mongodb.net/?retryWrites=true&w=majority&appName=Auth';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error: ', err));

// Configure CORS to allow requests from http://localhost:8081
app.use(cors({ origin: 'http://localhost:8081' }));

app.use(express.json());
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
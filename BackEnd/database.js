// database.js

const mongoose = require('mongoose');

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect('mongodb+srv://lpaing0019:Leoforlight1898@auth.a56tmrv.mongodb.net/?retryWrites=true&w=majority&appName=Auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  }
};

const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

module.exports = { connectDB, disconnectDB };

require('dotenv').config();

const DB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student_performance';

const connectDB = async () => {
  const mongoose = require('mongoose');
  try {
    const conn = await mongoose.connect(DB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

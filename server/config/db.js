require('dotenv').config();

const DB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student_performance';

const connectDB = async () => {
  const mongoose = require('mongoose');
  try {
    const conn = await mongoose.connect(DB_URI);

    // Remove stale unique index on rollNumber (legacy field) that causes
    // E11000 duplicate-key errors when adding students without a rollNumber.
    // The current schema uses enrolmentNumber instead; this index is no longer needed.
    try {
      await conn.connection.collection('students').dropIndex('rollNumber_1');
      console.log('Dropped stale index: rollNumber_1');
    } catch (idxErr) {
      // Ignore if the index does not exist
    }

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
{
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: {
      type: String,
      default: undefined,
      index: { unique: true, partialFilterExpression: { email: { $type: 'string' } } },
    },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'faculty', 'student'], default: 'student' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

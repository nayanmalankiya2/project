const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rollNumber: { type: String, required: true, unique: true },
    className: { type: String, required: true },
    email: { type: String, default: null },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);

const mongoose = require('mongoose');
const User = require('./User');

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    enrolmentNumber: { type: String, required: true, unique: true },
    className: { type: String, required: true },
    email: { type: String, default: null },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

// Cascade delete: when a student is deleted, also delete their associated User record
studentSchema.pre('deleteOne', { query: true, path: 'findOne' }, async function (next) {
  if (this.user) {
    await User.findByIdAndDelete(this.user);
  }
  next();
});

module.exports = mongoose.model('Student', studentSchema);

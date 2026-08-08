const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    maxMarks: { type: Number, default: 100 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subject', subjectSchema);

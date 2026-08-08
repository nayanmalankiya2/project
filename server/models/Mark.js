const mongoose = require('mongoose');

const markSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    marksObtained: { type: Number, required: true, min: 0 },
    maxMarks: { type: Number, default: 100 },
    term: { type: String, default: 'Term 1' },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Mark', markSchema);

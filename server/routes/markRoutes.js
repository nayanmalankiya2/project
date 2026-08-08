const express = require('express');
const Mark = require('../models/Mark');
const Student = require('../models/Student');
const Subject = require('../models/Subject');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

// Admin & Faculty can create/update/delete marks
// Student can view their own marks

// @route   GET /api/marks
// @desc    Get all marks (admin/faculty) or own marks (student)
router.get('/', async (req, res) => {
  try {
    if (req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user._id });
      if (!student) return res.json([]);
      const marks = await Mark.find({ student: student._id }).populate('subject', 'name code maxMarks');
      return res.json(marks);
    }

    const marks = await Mark.find().populate('student', 'name rollNumber className').populate('subject', 'name code maxMarks');
    res.json(marks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/marks
// @desc    Add marks (admin/faculty)
router.post('/', authorize('admin', 'faculty'), async (req, res) => {
  try {
    const mark = await Mark.create(req.body);
    res.status(201).json(mark);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   PUT /api/marks/:id
// @desc    Update marks (admin/faculty)
router.put('/:id', authorize('admin', 'faculty'), async (req, res) => {
  try {
    const mark = await Mark.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!mark) return res.status(404).json({ message: 'Mark not found' });
    res.json(mark);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   DELETE /api/marks/:id
// @desc    Delete marks (admin/faculty)
router.delete('/:id', authorize('admin', 'faculty'), async (req, res) => {
  try {
    const mark = await Mark.findByIdAndDelete(req.params.id);
    if (!mark) return res.status(404).json({ message: 'Mark not found' });
    res.json({ message: 'Mark deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

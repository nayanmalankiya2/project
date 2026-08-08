const express = require('express');
const Subject = require('../models/Subject');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All authenticated users (admin, faculty, student) can view subjects
router.use(protect);

// @route   GET /api/subjects
// @desc    Get all subjects (any authenticated user, including students for view-only)
router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/subjects
// @desc    Create a subject (admin/faculty only)
router.post('/', authorize('admin', 'faculty'), async (req, res) => {
  try {
    const subject = await Subject.create(req.body);
    res.status(201).json(subject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   PUT /api/subjects/:id
// @desc    Update a subject (admin/faculty only)
router.put('/:id', authorize('admin', 'faculty'), async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.json(subject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   DELETE /api/subjects/:id
// @desc    Delete a subject (admin only)
router.delete('/:id', authorize('admin'), async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.json({ message: 'Subject deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

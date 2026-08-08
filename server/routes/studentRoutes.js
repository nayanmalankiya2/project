const express = require('express');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/students/me
// @desc    Get the logged-in student's own profile (accessible by any authenticated user)
router.get('/me', protect, async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id }).populate('user', 'name username email');
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin and Faculty can manage students (faculty = student control only)
router.use(protect, authorize('admin', 'faculty'));

// @route   GET /api/students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().populate('user', 'name username email');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/students/:id
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('user', 'name username email');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/students
// @desc    Create a student. If username & password provided, also creates a linked student login account
router.post('/', async (req, res) => {
  try {
    const { username, password, ...studentData } = req.body;

    let userId = null;
    if (username && password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await User.create({
        name: studentData.name,
        username,
        email: studentData.email || '',
        password: hashedPassword,
        role: 'student',
      });
      userId = user._id;
    }

    const student = await Student.create({ ...studentData, user: userId });
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   PUT /api/students/:id
// @desc    Update a student. If username/password provided, creates or updates the linked student login account
router.put('/:id', async (req, res) => {
  try {
    const { username, password, ...studentData } = req.body;

    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Create or update linked user account
    if (username) {
      let user = student.user ? await User.findById(student.user) : null;
      if (user) {
        const updates = { name: studentData.name || user.name, username };
        if (password) {
          const salt = await bcrypt.genSalt(10);
          updates.password = await bcrypt.hash(password, salt);
        }
        user = await User.findByIdAndUpdate(user._id, updates, { new: true });
      } else {
        const salt = await bcrypt.genSalt(10);
        user = await User.create({
          name: studentData.name,
          username,
          email: studentData.email || '',
          password: await bcrypt.hash(password || 'student123', salt),
          role: 'student',
        });
      }
      student.user = user._id;
    }

    Object.assign(student, studentData);
    await student.save();
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   DELETE /api/students/:id
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    // Also delete related marks
    const Mark = require('../models/Mark');
    await Mark.deleteMany({ student: req.params.id });
    // Delete linked user account if exists
    if (student.user) {
      await User.findByIdAndDelete(student.user);
    }
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

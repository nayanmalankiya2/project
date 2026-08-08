const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All user routes require admin role (full control)
router.use(protect, authorize('admin'));

// @route   GET /api/users
// @desc    Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/users
// @desc    Create a user (admin/faculty/student accounts)
router.post('/', async (req, res) => {
  try {
const { name, username, email, password, role } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ name, username, email, password: hashedPassword, role });
    res.status(201).json({ _id: user._id, name: user.name, username: user.username, email: user.email, role: user.role });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   PUT /api/users/:id
// @desc    Update a user
router.put('/:id', async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    let updates = rest;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete a user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

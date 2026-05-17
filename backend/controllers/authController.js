const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// ===== SIGNUP =====
// POST /api/signup
const signup = async (req, res) => {
  try {
    const { name, email, phone, password, role, university, hostelName, city } = req.body;

    // Validation
    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered. Please login instead.' });
    }

    // Create user (password is hashed automatically via pre-save hook)
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role,
      university: university || null,
      hostelName: hostelName || null,
      city: city || null,
    });

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    console.error('Signup error:', err);

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages[0] });
    }

    // Handle duplicate key error (race condition)
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Email already registered. Please login instead.' });
    }

    res.status(500).json({ error: 'Server error. Please try again.' });
  }
};

// ===== LOGIN =====
// POST /api/login
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email and role, explicitly select password
    const query = { email };
    if (role) query.role = role;

    const user = await User.findOne(query).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful!',
      token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
};

// ===== GET CURRENT USER (Protected) =====
// GET /api/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
};

// ===== GET ALL USERS (Admin/debug endpoint) =====
// GET /api/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-__v');
    res.json(users);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
};

module.exports = { signup, login, getMe, getAllUsers };

const crypto = require('crypto');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

const sendAuthResponse = (res, status, message, user) => {
  const token = generateToken(user._id);
  res.status(status).json({ message, token, user: user.toSafeObject() });
};

const signup = async (req, res, next) => {
  try {
    const { name, email, phone, password, role = 'owner', university, hostelName, city } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: 'Name, email, phone, and password are required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    if (role !== 'owner') {
      return res.status(403).json({ error: 'Only hostel owner registration is available here' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered. Please login instead.' });
    }

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

    sendAuthResponse(res, 201, 'Owner account created successfully', user);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email, role: 'owner' }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid owner email or password' });
    }

    sendAuthResponse(res, 200, 'Login successful', user);
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await User.findOne({ email, role: 'owner' });
    if (!user) {
      return res.json({ message: 'If this owner email exists, reset instructions will be sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    res.json({
      message: 'Password reset token generated. Connect an email provider to send it automatically.',
      resetToken: process.env.NODE_ENV === 'production' ? undefined : resetToken,
    });
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const allowed = ['name', 'phone', 'city', 'hostelName', 'avatar', 'notificationPreferences'];
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) req.user[key] = req.body[key];
    });
    await req.user.save();
    res.json({ message: 'Profile updated', user: req.user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res) => {
  res.json({ user: req.user.toSafeObject() });
};

module.exports = { signup, login, forgotPassword, changePassword, updateProfile, getMe };

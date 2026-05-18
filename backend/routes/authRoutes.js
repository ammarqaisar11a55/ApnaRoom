const express = require('express');
const { signup, login, forgotPassword, changePassword, updateProfile, getMe } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/register', signup);
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

router.use(protect, authorize('owner'));
router.get('/me', getMe);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

module.exports = router;

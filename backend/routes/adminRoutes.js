const express = require('express');
const {
  getAdminHostels,
  approveHostel,
  rejectHostel,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Secure all admin routes — only accessible by authenticated users with 'admin' role
router.use(protect, authorize('admin'));

router.get('/hostels', getAdminHostels);
router.put('/hostels/:id/approve', approveHostel);
router.put('/hostels/:id/reject', rejectHostel);

module.exports = router;

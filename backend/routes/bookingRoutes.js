const express = require('express');
const { getBookings, createBooking, updateBookingStatus, createPublicInquiry } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { bookingStatusRequest } = require('../validators/ownerDashboardSchemas');

const router = express.Router();

// ===== PUBLIC: Student inquiry (no auth required) =====
router.post('/inquire', createPublicInquiry);

// ===== PROTECTED: Owner-only routes =====
router.use(protect, authorize('owner'));
router.route('/').get(getBookings).post(createBooking);
router.put('/:id/status', validate(bookingStatusRequest), updateBookingStatus);

module.exports = router;

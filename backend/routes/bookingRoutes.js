const express = require('express');
const { getBookings, createBooking, updateBookingStatus } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { bookingStatusRequest } = require('../validators/ownerDashboardSchemas');

const router = express.Router();

router.use(protect, authorize('owner'));
router.route('/').get(getBookings).post(createBooking);
router.put('/:id/status', validate(bookingStatusRequest), updateBookingStatus);

module.exports = router;

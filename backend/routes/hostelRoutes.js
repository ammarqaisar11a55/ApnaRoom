const express = require('express');
const {
  getHostels,
  getHostel,
  createHostel,
  updateHostel,
  deleteHostel,
  getAnalytics,
} = require('../controllers/hostelController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { upload } = require('../middleware/upload');
const { hostelRequest, hostelIdRequest, hostelUpdateRequest } = require('../validators/ownerDashboardSchemas');

const router = express.Router();

router.use(protect, authorize('owner'));
router.get('/analytics/summary', getAnalytics);
router.route('/').get(getHostels).post(
  upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'images', maxCount: 10 }]),
  validate(hostelRequest),
  createHostel
);
router.route('/:id')
  .get(validate(hostelIdRequest), getHostel)
  .put(
    upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'images', maxCount: 10 }]),
    validate(hostelUpdateRequest),
    updateHostel
  )
  .delete(validate(hostelIdRequest), deleteHostel);

module.exports = router;

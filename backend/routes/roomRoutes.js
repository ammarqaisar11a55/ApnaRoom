const express = require('express');
const { getRooms, createRoom, updateRoom, deleteRoom } = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { upload } = require('../middleware/upload');
const { hostelIdRequest, roomRequest, roomUpdateRequest } = require('../validators/ownerDashboardSchemas');

const router = express.Router();

router.use(protect, authorize('owner'));
router.route('/').get(getRooms).post(
  upload.fields([{ name: 'roomImages', maxCount: 8 }]),
  validate(roomRequest),
  createRoom
);
router.route('/:id')
  .put(
    upload.fields([{ name: 'roomImages', maxCount: 8 }]),
    validate(roomUpdateRequest),
    updateRoom
  )
  .delete(validate(hostelIdRequest), deleteRoom);

module.exports = router;

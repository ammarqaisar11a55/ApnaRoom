const express = require('express');
const { getNotifications, markRead } = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('owner'));
router.get('/', getNotifications);
router.put('/read', markRead);

module.exports = router;

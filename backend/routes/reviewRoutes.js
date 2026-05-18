const express = require('express');
const { getReviews, createReview, replyToReview, moderateReview } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { reviewReplyRequest, reviewModerationRequest } = require('../validators/ownerDashboardSchemas');

const router = express.Router();

router.use(protect, authorize('owner'));
router.route('/').get(getReviews).post(createReview);
router.post('/reply', validate(reviewReplyRequest), replyToReview);
router.put('/:id/moderate', validate(reviewModerationRequest), moderateReview);

module.exports = router;

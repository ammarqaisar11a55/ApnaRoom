const Review = require('../models/Review');
const Notification = require('../models/Notification');
const { paginate } = require('../utils/query');

const getReviews = async (req, res, next) => {
  try {
    const filter = { owner: req.user._id };
    if (req.query.status) filter.status = req.query.status;

    const result = await paginate(
      Review.find(filter).populate('hostel', 'name city').sort({ createdAt: -1 }),
      Review.countDocuments(filter),
      req.query
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const createReview = async (req, res, next) => {
  try {
    const review = await Review.create({ ...req.body, owner: req.user._id });
    await Notification.create({
      owner: req.user._id,
      type: 'review_new',
      title: 'New tenant review',
      message: `${review.authorName} left a ${review.rating}-star review.`,
      metadata: { review: review._id },
    });
    res.status(201).json({ message: 'Review created', item: review });
  } catch (err) {
    next(err);
  }
};

const replyToReview = async (req, res, next) => {
  try {
    const review = await Review.findOneAndUpdate(
      { _id: req.body.reviewId, owner: req.user._id },
      { reply: { message: req.body.message, repliedAt: new Date() } },
      { new: true }
    );
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json({ message: 'Reply saved', item: review });
  } catch (err) {
    next(err);
  }
};

const moderateReview = async (req, res, next) => {
  try {
    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json({ message: 'Review moderated', item: review });
  } catch (err) {
    next(err);
  }
};

module.exports = { getReviews, createReview, replyToReview, moderateReview };

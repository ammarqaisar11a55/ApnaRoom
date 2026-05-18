const Notification = require('../models/Notification');
const { paginate } = require('../utils/query');

const getNotifications = async (req, res, next) => {
  try {
    const filter = { owner: req.user._id };
    if (req.query.read !== undefined) filter.read = req.query.read === 'true';

    const result = await paginate(
      Notification.find(filter).sort({ createdAt: -1 }),
      Notification.countDocuments(filter),
      req.query
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const markRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ owner: req.user._id, _id: { $in: req.body.ids || [] } }, { read: true });
    res.json({ message: 'Notifications marked as read' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getNotifications, markRead };

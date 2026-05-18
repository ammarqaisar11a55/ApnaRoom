const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const { paginate } = require('../utils/query');

const getBookings = async (req, res, next) => {
  try {
    const filter = { owner: req.user._id };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;

    const result = await paginate(
      Booking.find(filter).populate('hostel', 'name city').populate('room', 'roomNumber roomType').sort({ createdAt: -1 }),
      Booking.countDocuments(filter),
      req.query
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const createBooking = async (req, res, next) => {
  try {
    const booking = await Booking.create({ ...req.body, owner: req.user._id });
    await Notification.create({
      owner: req.user._id,
      type: 'booking_new',
      title: 'New booking request',
      message: `${booking.guest.name} requested ${booking.bedsRequested} bed(s).`,
      metadata: { booking: booking._id },
    });
    res.status(201).json({ message: 'Booking created', item: booking });
  } catch (err) {
    next(err);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, paymentStatus } = req.body;
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { ...(status ? { status } : {}), ...(paymentStatus ? { paymentStatus } : {}) },
      { new: true, runValidators: true }
    );
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    if (paymentStatus === 'Paid') {
      await Notification.create({
        owner: req.user._id,
        type: 'payment_received',
        title: 'Payment marked paid',
        message: `${booking.guest.name}'s booking payment is now marked as paid.`,
        metadata: { booking: booking._id },
      });
    }

    res.json({ message: 'Booking updated', item: booking });
  } catch (err) {
    next(err);
  }
};

module.exports = { getBookings, createBooking, updateBookingStatus };

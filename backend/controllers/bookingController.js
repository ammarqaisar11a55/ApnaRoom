const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const Hostel = require('../models/Hostel');
const { paginate } = require('../utils/query');

// ===== PUBLIC: Student inquiry (no auth required) =====
const createPublicInquiry = async (req, res, next) => {
  try {
    const { hostelId, guest, preferredRoomType, requestedMoveIn, bedsRequested, notes } = req.body;

    // Validate required fields
    if (!hostelId || !guest?.name || !guest?.email || !guest?.phone) {
      return res.status(400).json({ error: 'Hostel, guest name, email, and phone are required' });
    }

    // Find the hostel and its owner
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) return res.status(404).json({ error: 'Hostel not found' });

    // Create booking under the hostel owner
    const booking = await Booking.create({
      owner: hostel.owner,
      hostel: hostel._id,
      guest: {
        name: guest.name.trim(),
        email: guest.email.trim().toLowerCase(),
        phone: guest.phone.trim(),
        university: guest.university?.trim() || undefined,
      },
      requestedMoveIn: requestedMoveIn ? new Date(requestedMoveIn) : undefined,
      bedsRequested: bedsRequested || 1,
      notes: notes?.trim() || undefined,
      status: 'Pending',
      paymentStatus: 'Unpaid',
    });

    // Create notification for the hostel owner
    await Notification.create({
      owner: hostel.owner,
      type: 'booking_new',
      title: 'New Student Inquiry',
      message: `${guest.name} inquired about ${hostel.name} — ${bedsRequested || 1} bed(s) requested.`,
      metadata: { booking: booking._id },
    });

    // Increment inquiry count on hostel analytics
    hostel.analytics = hostel.analytics || { views: 0, inquiries: 0, conversionRate: 0 };
    hostel.analytics.inquiries = (hostel.analytics.inquiries || 0) + 1;
    await hostel.save();

    res.status(201).json({ message: 'Inquiry submitted successfully! The hostel owner will review your request.' });
  } catch (err) {
    next(err);
  }
};

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

module.exports = { getBookings, createBooking, updateBookingStatus, createPublicInquiry };

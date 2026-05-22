const Hostel = require('../models/Hostel');

// @desc    Get all hostels with status filter and owner info
// @route   GET /api/admin/hostels
// @access  Private/Admin
const getAdminHostels = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status && req.query.status !== 'All') {
      // Handle casing
      const statusValue = req.query.status.toLowerCase();
      filter.status = statusValue;
    }
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: new RegExp(req.query.search, 'i') } },
        { city: { $regex: new RegExp(req.query.search, 'i') } },
        { address: { $regex: new RegExp(req.query.search, 'i') } },
      ];
    }

    const hostels = await Hostel.find(filter)
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ items: hostels });
  } catch (err) {
    next(err);
  }
};

// @desc    Approve a hostel listing
// @route   PUT /api/admin/hostels/:id/approve
// @access  Private/Admin
const approveHostel = async (req, res, next) => {
  try {
    const hostel = await Hostel.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true, runValidators: true }
    ).populate('owner', 'name email phone');

    if (!hostel) {
      return res.status(404).json({ error: 'Hostel not found' });
    }

    res.json({ message: 'Hostel approved successfully', item: hostel });
  } catch (err) {
    next(err);
  }
};

// @desc    Reject a hostel listing
// @route   PUT /api/admin/hostels/:id/reject
// @access  Private/Admin
const rejectHostel = async (req, res, next) => {
  try {
    const hostel = await Hostel.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true, runValidators: true }
    ).populate('owner', 'name email phone');

    if (!hostel) {
      return res.status(404).json({ error: 'Hostel not found' });
    }

    res.json({ message: 'Hostel rejected successfully', item: hostel });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAdminHostels,
  approveHostel,
  rejectHostel,
};

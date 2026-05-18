const Hostel = require('../models/Hostel');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Tenant = require('../models/Tenant');
const { paginate } = require('../utils/query');
const { mapUploadedImages } = require('../middleware/upload');

const ownerFilter = (req, extra = {}) => ({ owner: req.user._id, ...extra });

const normalizeHostelPayload = async (req) => {
  const body = { ...req.body };
  body.pricing = body.pricing || {
    monthlyRent: body.monthlyRent,
    securityDeposit: body.securityDeposit,
    electricityCharges: body.electricityCharges,
    internetCharges: body.internetCharges,
    messCharges: body.messCharges,
  };
  body.contact = body.contact || {
    phone: body.phone,
    whatsapp: body.whatsapp,
    emergency: body.emergency,
  };
  body.timings = body.timings || {
    checkIn: body.checkIn,
    checkOut: body.checkOut,
  };

  const uploaded = await mapUploadedImages(req.files, 'apnaroom/hostels');
  if (uploaded.thumbnail) body.thumbnail = uploaded.thumbnail;
  if (uploaded.images.length) body.images = [...(body.images || []), ...uploaded.images];

  [
    'monthlyRent',
    'securityDeposit',
    'electricityCharges',
    'internetCharges',
    'messCharges',
    'phone',
    'whatsapp',
    'emergency',
    'checkIn',
    'checkOut',
  ].forEach((key) => delete body[key]);

  return body;
};

const getHostels = async (req, res, next) => {
  try {
    const filter = ownerFilter(req);
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) filter.$text = { $search: req.query.search };

    const result = await paginate(
      Hostel.find(filter).sort({ createdAt: -1 }),
      Hostel.countDocuments(filter),
      req.query
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getHostel = async (req, res, next) => {
  try {
    const hostel = await Hostel.findOne(ownerFilter(req, { _id: req.params.id }));
    if (!hostel) return res.status(404).json({ error: 'Hostel not found' });
    res.json({ item: hostel });
  } catch (err) {
    next(err);
  }
};

const createHostel = async (req, res, next) => {
  try {
    const payload = await normalizeHostelPayload(req);
    const hostel = await Hostel.create({ ...payload, owner: req.user._id });
    res.status(201).json({ message: 'Hostel created', item: hostel });
  } catch (err) {
    next(err);
  }
};

const updateHostel = async (req, res, next) => {
  try {
    const payload = await normalizeHostelPayload(req);
    const hostel = await Hostel.findOneAndUpdate(ownerFilter(req, { _id: req.params.id }), payload, {
      new: true,
      runValidators: true,
    });
    if (!hostel) return res.status(404).json({ error: 'Hostel not found' });
    res.json({ message: 'Hostel updated', item: hostel });
  } catch (err) {
    next(err);
  }
};

const deleteHostel = async (req, res, next) => {
  try {
    const hostel = await Hostel.findOneAndDelete(ownerFilter(req, { _id: req.params.id }));
    if (!hostel) return res.status(404).json({ error: 'Hostel not found' });
    await Promise.all([
      Room.deleteMany({ hostel: hostel._id, owner: req.user._id }),
      Booking.deleteMany({ hostel: hostel._id, owner: req.user._id }),
      Tenant.deleteMany({ hostel: hostel._id, owner: req.user._id }),
    ]);
    res.json({ message: 'Hostel and related operational records deleted' });
  } catch (err) {
    next(err);
  }
};

const getAnalytics = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const [hostels, rooms, bookings, tenants, monthlyRevenue] = await Promise.all([
      Hostel.find({ owner }),
      Room.find({ owner }),
      Booking.find({ owner }).populate('hostel', 'name'),
      Tenant.find({ owner, status: 'Active' }),
      Booking.aggregate([
        { $match: { owner, paymentStatus: { $in: ['Paid', 'Partial'] } } },
        {
          $group: {
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
            revenue: { $sum: '$amount' },
            bookings: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
    ]);

    const capacity = rooms.reduce((sum, room) => sum + room.capacity, 0);
    const occupied = rooms.reduce((sum, room) => sum + room.occupiedBeds, 0);
    const mostBooked = bookings.reduce((acc, booking) => {
      const name = booking.hostel?.name || 'Unknown hostel';
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});

    res.json({
      metrics: {
        totalHostels: hostels.length,
        publishedHostels: hostels.filter((item) => item.status === 'published').length,
        totalBookings: bookings.length,
        pendingBookings: bookings.filter((item) => item.status === 'Pending').length,
        activeTenants: tenants.length,
        occupancyRate: capacity ? Math.round((occupied / capacity) * 100) : 0,
        availableRooms: rooms.filter((item) => item.status === 'Available').length,
        monthlyRevenueTotal: bookings.reduce((sum, item) => sum + (['Paid', 'Partial'].includes(item.paymentStatus) ? item.amount : 0), 0),
        mostBookedHostel: Object.entries(mostBooked).sort((a, b) => b[1] - a[1])[0]?.[0] || 'No bookings yet',
      },
      monthlyRevenue: monthlyRevenue.map((item) => ({
        month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
        revenue: item.revenue,
        bookings: item.bookings,
      })),
      roomStats: [
        { name: 'Available', value: rooms.filter((item) => item.status === 'Available').length },
        { name: 'Full', value: rooms.filter((item) => item.status === 'Full').length },
        { name: 'Maintenance', value: rooms.filter((item) => item.status === 'Maintenance').length },
      ],
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getHostels, getHostel, createHostel, updateHostel, deleteHostel, getAnalytics };

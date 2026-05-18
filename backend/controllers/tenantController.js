const Tenant = require('../models/Tenant');
const Room = require('../models/Room');
const { paginate } = require('../utils/query');

const getTenants = async (req, res, next) => {
  try {
    const filter = { owner: req.user._id };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) filter.$text = { $search: req.query.search };

    const result = await paginate(
      Tenant.find(filter).populate('hostel', 'name city').populate('room', 'roomNumber roomType').sort({ createdAt: -1 }),
      Tenant.countDocuments(filter),
      req.query
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const createTenant = async (req, res, next) => {
  try {
    const roomId = req.body.room || undefined;
    const tenant = await Tenant.create({ ...req.body, room: roomId, owner: req.user._id });
    if (tenant.room) {
      await Room.findOneAndUpdate(
        { _id: tenant.room, owner: req.user._id, availableBeds: { $gt: 0 } },
        { $inc: { occupiedBeds: 1 } },
        { runValidators: true }
      );
    }
    res.status(201).json({ message: 'Tenant added', item: tenant });
  } catch (err) {
    next(err);
  }
};

const updateTenant = async (req, res, next) => {
  try {
    const current = await Tenant.findOne({ _id: req.params.id, owner: req.user._id });
    if (!current) return res.status(404).json({ error: 'Tenant not found' });

    const nextRoom = req.body.room || undefined;
    if (String(current.room || '') !== String(nextRoom || '')) {
      if (current.room) await Room.findOneAndUpdate({ _id: current.room, owner: req.user._id }, { $inc: { occupiedBeds: -1 }, status: 'Available' });
      if (nextRoom) await Room.findOneAndUpdate({ _id: nextRoom, owner: req.user._id, availableBeds: { $gt: 0 } }, { $inc: { occupiedBeds: 1 } });
    }

    const tenant = await Tenant.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, { ...req.body, room: nextRoom }, {
      new: true,
      runValidators: true,
    });
    res.json({ message: 'Tenant updated', item: tenant });
  } catch (err) {
    next(err);
  }
};

const removeTenant = async (req, res, next) => {
  try {
    const tenant = await Tenant.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { status: 'Left', moveOutDate: new Date() },
      { new: true }
    );
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });
    if (tenant.room) {
      await Room.findOneAndUpdate({ _id: tenant.room, owner: req.user._id }, { $inc: { occupiedBeds: -1 }, status: 'Available' });
    }
    res.json({ message: 'Tenant removed', item: tenant });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTenants, createTenant, updateTenant, removeTenant };

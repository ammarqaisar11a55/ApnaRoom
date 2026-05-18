const Room = require('../models/Room');
const Hostel = require('../models/Hostel');
const { paginate } = require('../utils/query');
const { mapUploadedImages } = require('../middleware/upload');

const getRooms = async (req, res, next) => {
  try {
    const filter = { owner: req.user._id };
    if (req.query.hostel) filter.hostel = req.query.hostel;
    if (req.query.status) filter.status = req.query.status;

    const result = await paginate(
      Room.find(filter).populate('hostel', 'name city').sort({ createdAt: -1 }),
      Room.countDocuments(filter),
      req.query
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const createRoom = async (req, res, next) => {
  try {
    const hostel = await Hostel.findOne({ _id: req.body.hostel, owner: req.user._id });
    if (!hostel) return res.status(404).json({ error: 'Hostel not found' });

    const uploaded = await mapUploadedImages(req.files, 'apnaroom/rooms');
    const room = await Room.create({ ...req.body, images: uploaded.images, owner: req.user._id });
    await Hostel.findByIdAndUpdate(hostel._id, { $inc: { totalRooms: 1, availableRooms: room.status === 'Available' ? 1 : 0 } });
    res.status(201).json({ message: 'Room created', item: room });
  } catch (err) {
    next(err);
  }
};

const updateRoom = async (req, res, next) => {
  try {
    const existing = await Room.findOne({ _id: req.params.id, owner: req.user._id });
    if (!existing) return res.status(404).json({ error: 'Room not found' });

    const uploaded = await mapUploadedImages(req.files, 'apnaroom/rooms');
    const room = await Room.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, {
      ...req.body,
      images: uploaded.images.length ? [...existing.images, ...uploaded.images] : existing.images,
    }, {
      new: true,
      runValidators: true,
    });
    if (existing.status !== room.status) {
      const delta = (room.status === 'Available' ? 1 : 0) - (existing.status === 'Available' ? 1 : 0);
      if (delta) await Hostel.findByIdAndUpdate(room.hostel, { $inc: { availableRooms: delta } });
    }
    res.json({ message: 'Room updated', item: room });
  } catch (err) {
    next(err);
  }
};

const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!room) return res.status(404).json({ error: 'Room not found' });
    await Hostel.findByIdAndUpdate(room.hostel, { $inc: { totalRooms: -1, availableRooms: room.status === 'Available' ? -1 : 0 } });
    res.json({ message: 'Room deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getRooms, createRoom, updateRoom, deleteRoom };

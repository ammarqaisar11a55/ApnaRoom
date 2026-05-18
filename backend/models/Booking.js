const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    hostel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true, index: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
    guest: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, lowercase: true, trim: true },
      phone: { type: String, required: true, trim: true },
      university: String,
    },
    requestedMoveIn: Date,
    bedsRequested: { type: Number, default: 1, min: 1 },
    amount: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Completed'], default: 'Pending', index: true },
    paymentStatus: { type: String, enum: ['Paid', 'Unpaid', 'Partial'], default: 'Unpaid', index: true },
    notes: String,
  },
  { timestamps: true }
);

bookingSchema.index({ owner: 1, createdAt: -1 });
bookingSchema.index({ status: 1, paymentStatus: 1 });

module.exports = mongoose.model('Booking', bookingSchema);

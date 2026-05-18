const mongoose = require('mongoose');

const paymentRecordSchema = new mongoose.Schema(
  {
    month: String,
    amount: { type: Number, min: 0 },
    status: { type: String, enum: ['Paid', 'Unpaid', 'Partial'], default: 'Unpaid' },
    paidAt: Date,
  },
  { _id: false }
);

const tenantSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    hostel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true, index: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    cnic: { type: String, trim: true },
    university: String,
    guardianName: String,
    guardianPhone: String,
    moveInDate: { type: Date, required: true },
    moveOutDate: Date,
    status: { type: String, enum: ['Active', 'Notice', 'Left'], default: 'Active', index: true },
    paymentRecords: [paymentRecordSchema],
  },
  { timestamps: true }
);

tenantSchema.index({ owner: 1, status: 1 });
tenantSchema.index({ name: 'text', phone: 'text', email: 'text' });

module.exports = mongoose.model('Tenant', tenantSchema);

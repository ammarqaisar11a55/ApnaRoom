const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    hostel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true, index: true },
    roomNumber: { type: String, required: true, trim: true },
    roomType: { type: String, enum: ['Single', 'Double', 'Triple', 'Shared'], required: true },
    capacity: { type: Number, required: true, min: 1 },
    occupiedBeds: { type: Number, default: 0, min: 0 },
    availableBeds: { type: Number, default: 0, min: 0 },
    pricePerBed: { type: Number, required: true, min: 0 },
    attachedBathroom: { type: Boolean, default: false },
    airConditioned: { type: Boolean, default: false },
    images: [{
      url: { type: String, required: true },
      publicId: String,
      alt: String,
    }],
    status: { type: String, enum: ['Available', 'Full', 'Maintenance'], default: 'Available', index: true },
  },
  { timestamps: true }
);

roomSchema.pre('validate', function calculateBeds(next) {
  this.availableBeds = Math.max((this.capacity || 0) - (this.occupiedBeds || 0), 0);
  if (this.availableBeds === 0 && this.status === 'Available') this.status = 'Full';
  next();
});

roomSchema.index({ hostel: 1, roomNumber: 1 }, { unique: true });

module.exports = mongoose.model('Room', roomSchema);

const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: String,
    alt: String,
  },
  { _id: false }
);

const analyticsSchema = new mongoose.Schema(
  {
    views: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },
  },
  { _id: false }
);

const hostelSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, trim: true, lowercase: true, index: true },
    description: { type: String, required: true, trim: true, maxlength: 3000 },
    type: { type: String, enum: ['Boys', 'Girls', 'Mixed'], required: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true, index: true },
    googleMapsLocation: { type: String, trim: true },
    nearbyUniversities: [{ type: String, trim: true }],
    pricing: {
      monthlyRent: { type: Number, required: true, min: 0 },
      securityDeposit: { type: Number, default: 0, min: 0 },
      electricityCharges: { type: Number, default: 0, min: 0 },
      internetCharges: { type: Number, default: 0, min: 0 },
      messCharges: { type: Number, default: 0, min: 0 },
    },
    floors: { type: Number, default: 1, min: 1 },
    totalRooms: { type: Number, default: 0, min: 0 },
    availableRooms: { type: Number, default: 0, min: 0 },
    roomTypes: [{ type: String, enum: ['Single', 'Double', 'Triple', 'Shared'] }],
    facilities: [{
      type: String,
      enum: [
        'WiFi',
        'Laundry',
        'Mess',
        'Air Conditioning',
        'Attached Bathroom',
        'Parking',
        'CCTV',
        'Security Guard',
        'Generator',
        'Water Cooler',
        'Study Room',
        'Kitchen',
        'Furnished Rooms',
        'Geyser',
        'Elevator',
      ],
    }],
    rules: [{ type: String, trim: true }],
    contact: {
      phone: { type: String, required: true, trim: true },
      whatsapp: { type: String, trim: true },
      emergency: { type: String, trim: true },
    },
    timings: {
      checkIn: { type: String, default: '14:00' },
      checkOut: { type: String, default: '11:00' },
    },
    thumbnail: imageSchema,
    images: [imageSchema],
    policies: { type: String, default: '' },
    status: { type: String, enum: ['draft', 'published', 'unpublished', 'pending', 'approved', 'rejected'], default: 'pending', index: true },
    analytics: analyticsSchema,
  },
  { timestamps: true }
);

hostelSchema.pre('save', function slugify(next) {
  if (!this.slug && this.name) {
    this.slug = `${this.name}-${this._id}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

hostelSchema.index({ owner: 1, status: 1 });
hostelSchema.index({ name: 'text', description: 'text', city: 'text', address: 'text' });

module.exports = mongoose.model('Hostel', hostelSchema);

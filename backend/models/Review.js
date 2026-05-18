const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    hostel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true, index: true },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
    authorName: { type: String, required: true, trim: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true, trim: true, maxlength: 1200 },
    status: { type: String, enum: ['Pending', 'Published', 'Hidden'], default: 'Pending', index: true },
    reply: {
      message: String,
      repliedAt: Date,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ owner: 1, status: 1 });

module.exports = mongoose.model('Review', reviewSchema);

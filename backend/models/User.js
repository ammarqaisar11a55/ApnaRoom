const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't return password in queries by default
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: {
        values: ['student', 'owner', 'admin'],
        message: 'Role must be student, owner, or admin',
      },
      default: 'owner',
    },
    university: {
      type: String,
      default: null,
    },
    hostelName: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    avatar: String,
    notificationPreferences: {
      bookings: { type: Boolean, default: true },
      payments: { type: Boolean, default: true },
      reviews: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false },
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// ===== PRE-SAVE HOOK: Hash password before saving =====
userSchema.pre('save', async function () {
  // Only hash if password was modified (or is new)
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// ===== INSTANCE METHOD: Compare password =====
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// ===== INSTANCE METHOD: Return safe user object (no password) =====
userSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    role: this.role,
    university: this.university,
    hostelName: this.hostelName,
    city: this.city,
    avatar: this.avatar,
    notificationPreferences: this.notificationPreferences,
    createdAt: this.createdAt,
  };
};

userSchema.index({ role: 1, city: 1 });

module.exports = mongoose.model('User', userSchema);

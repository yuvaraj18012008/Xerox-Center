import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    // Personal Information
    firstName: {
      type: String,
      required: [true, 'Please provide your first name'],
      trim: true,
      maxlength: [50, 'First name cannot be more than 50 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Please provide your last name'],
      trim: true,
      maxlength: [50, 'Last name cannot be more than 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // Don't return password by default
    },

    // Address Information
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: 'India' }
    },

    // User Type
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer'
    },

    // Account Status
    isActive: {
      type: Boolean,
      default: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: String,
    verificationTokenExpire: Date,

    // Password Reset
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    // Profile Information
    profileImage: String,
    totalOrders: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0
    },
    loyaltyPoints: {
      type: Number,
      default: 0
    },

    // Preferences
    preferences: {
      language: { type: String, default: 'en', enum: ['en', 'ta'] }, // English, Tamil
      darkMode: { type: Boolean, default: false },
      emailNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: true }
    },

    // Saved Data
    savedAddresses: [
      {
        label: String,
        address: String,
        isDefault: Boolean
      }
    ]
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

// Method to match password
userSchema.methods.matchPassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

// Method to get JWT token
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

const User = mongoose.model('User', userSchema);

export default User;

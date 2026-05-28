import mongoose from 'mongoose';

const discountSchema = new mongoose.Schema(
  {
    // Discount Code/Coupon
    code: {
      type: String,
      required: true,
      uppercase: true,
      unique: true,
      trim: true,
      match: [/^[A-Z0-9]{4,12}$/, 'Code must be 4-12 alphanumeric characters']
    },

    // Discount Details
    description: String,
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0
    },
    maxDiscountAmount: Number, // For percentage discounts, max discount cap

    // Validity
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },

    // Restrictions
    minimumOrderValue: {
      type: Number,
      default: 0
    },
    applicableOn: {
      type: String,
      enum: ['all', 'specific_services', 'first_order'],
      default: 'all'
    },
    applicableServices: [mongoose.Schema.Types.ObjectId],

    // Usage Limits
    maxUsagePerUser: {
      type: Number,
      default: 1
    },
    totalUsageLimit: Number,
    totalUsed: {
      type: Number,
      default: 0
    },

    // Status
    isActive: {
      type: Boolean,
      default: true
    },

    // Tracking
    usedBy: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        usedAt: Date,
        orderId: mongoose.Schema.Types.ObjectId
      }
    ]
  },
  {
    timestamps: true
  }
);

// Method to validate coupon
discountSchema.methods.isValid = function () {
  const now = new Date();
  return (
    this.isActive &&
    this.startDate <= now &&
    this.endDate >= now &&
    (!this.totalUsageLimit || this.totalUsed < this.totalUsageLimit)
  );
};

// Method to calculate discount
discountSchema.methods.calculateDiscount = function (orderAmount) {
  if (orderAmount < this.minimumOrderValue) return 0;

  if (this.discountType === 'percentage') {
    const discount = (orderAmount * this.discountValue) / 100;
    return this.maxDiscountAmount ? Math.min(discount, this.maxDiscountAmount) : discount;
  } else {
    return this.discountValue;
  }
};

const Discount = mongoose.model('Discount', discountSchema);

export default Discount;

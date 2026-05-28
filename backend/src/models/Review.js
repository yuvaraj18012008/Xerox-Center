import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    // References
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    },

    // Review Content
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      enum: [1, 2, 3, 4, 5]
    },
    title: {
      type: String,
      maxlength: 100
    },
    comment: {
      type: String,
      maxlength: 1000
    },

    // Review Categories
    deliveryRating: Number,
    qualityRating: Number,
    priceRating: Number,
    supportRating: Number,

    // Attachments
    images: [String], // URLs of images uploaded with review

    // Verification
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: String,

    // Visibility
    isPublished: {
      type: Boolean,
      default: true
    },
    isHelpful: {
      type: Number,
      default: 0 // Count of helpful votes
    },

    // Admin Actions
    adminResponse: {
      message: String,
      respondedAt: Date,
      respondedBy: mongoose.Schema.Types.ObjectId
    }
  },
  {
    timestamps: true
  }
);

// Index for better query performance
reviewSchema.index({ userId: 1 });
reviewSchema.index({ orderId: 1 });
reviewSchema.index({ serviceId: 1 });
reviewSchema.index({ rating: 1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review;

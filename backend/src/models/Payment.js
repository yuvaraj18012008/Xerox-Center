import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    // Order Reference
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true
    },
    orderIdString: String,

    // Customer Reference
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // Payment Amount
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'INR'
    },

    // Payment Method
    method: {
      type: String,
      enum: ['cash', 'upi', 'card', 'qrcode', 'wallet', 'bank_transfer'],
      required: true
    },

    // Payment Gateway
    gateway: {
      type: String,
      enum: ['razorpay', 'stripe', 'none'],
      default: 'none'
    },

    // Transaction Details
    transactionId: {
      type: String,
      unique: true
    },
    referenceId: String,
    gatewayResponse: mongoose.Schema.Types.Mixed,

    // Payment Status
    status: {
      type: String,
      enum: ['pending', 'processing', 'success', 'failed', 'cancelled', 'refunded'],
      default: 'pending'
    },

    // UPI Details (if UPI payment)
    upiId: String,
    upiTransactionId: String,

    // Card Details (if card payment)
    cardLast4: String,
    cardBrand: String,

    // Refund Information
    isRefunded: {
      type: Boolean,
      default: false
    },
    refundAmount: Number,
    refundDetails: {
      reason: String,
      requestedAt: Date,
      processedAt: Date,
      refundId: String
    },

    // Timestamps
    initiatedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: Date,
    expiresAt: Date
  },
  {
    timestamps: true
  }
);

// Index for faster queries
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ customerId: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ status: 1 });

// Method to process refund
paymentSchema.methods.refund = async function (amount, reason) {
  this.isRefunded = true;
  this.status = 'refunded';
  this.refundAmount = amount;
  this.refundDetails = {
    reason,
    requestedAt: new Date(),
    processedAt: new Date()
  };
  return this.save();
};

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;

import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    // Order ID
    orderId: {
      type: String,
      unique: true,
      required: true
    },

    // Customer Reference
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    customerEmail: String,
    customerPhone: String,

    // Order Items
    items: [
      {
        serviceId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Service'
        },
        serviceName: String,
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        // Print Options
        printOptions: {
          type: {
            type: String,
            enum: ['BW', 'Color'],
            default: 'BW'
          },
          paperSize: {
            type: String,
            enum: ['A4', 'A3', 'A5', 'Letter'],
            default: 'A4'
          },
          sides: {
            type: String,
            enum: ['Single', 'Double'],
            default: 'Single'
          },
          orientation: {
            type: String,
            enum: ['Portrait', 'Landscape'],
            default: 'Portrait'
          },
          pageRange: String // e.g., "1-5, 10-15"
        },
        // File Information
        fileName: String,
        fileUrl: String,
        fileSize: Number,
        uploadedAt: Date,
        // Pricing
        unitPrice: Number,
        itemTotal: Number,
        // Special Instructions
        specialInstructions: String
      }
    ],

    // Pricing
    subtotal: {
      type: Number,
      required: true,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    discountCode: String,
    tax: {
      type: Number,
      default: 0
    },
    deliveryFee: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    },

    // Delivery/Pickup Information
    deliveryType: {
      type: String,
      enum: ['pickup', 'delivery'],
      default: 'pickup'
    },
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    pickupTime: Date,

    // Order Status
    status: {
      type: String,
      enum: ['pending', 'accepted', 'printing', 'ready', 'delivered', 'cancelled'],
      default: 'pending'
    },
    statusHistory: [
      {
        status: String,
        timestamp: Date,
        notes: String,
        updatedBy: mongoose.Schema.Types.ObjectId
      }
    ],

    // Payment Information
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'upi', 'card', 'qrcode', 'wallet'],
      default: 'cash'
    },
    transactionId: String,
    paymentDetails: {
      gatewayReference: String,
      timestamp: Date,
      method: String
    },

    // Timeline
    orderDate: {
      type: Date,
      default: Date.now
    },
    expectedDelivery: Date,
    actualDelivery: Date,

    // Notes
    internalNotes: String,
    customerNotes: String,

    // Admin Tracking
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

// Pre-save middleware to generate or update orderId
orderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    const count = await mongoose.model('Order').countDocuments();
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    this.orderId = `XC-${dateStr}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Add status changes to history
orderSchema.methods.updateStatus = async function (newStatus, notes = '', userId = null) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: Date.now(),
    notes,
    updatedBy: userId
  });
  return this.save();
};

// Calculate estimated delivery
orderSchema.methods.calculateEstimatedDelivery = function () {
  const estimatedTime = 2; // 2 hours default
  this.expectedDelivery = new Date(Date.now() + estimatedTime * 60 * 60 * 1000);
};

const Order = mongoose.model('Order', orderSchema);

export default Order;

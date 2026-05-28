import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    // Service Details
    name: {
      type: String,
      required: [true, 'Please provide service name'],
      unique: true,
      trim: true,
      maxlength: [100, 'Service name cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: true,
      maxlength: [500, 'Description cannot be more than 500 characters']
    },

    // Pricing
    basePrice: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      default: 'INR'
    },

    // Service Icon/Image
    icon: String,
    image: String,

    // Service Category
    category: {
      type: String,
      enum: ['xerox', 'printing', 'scanning', 'binding', 'lamination', 'photos', 'forms', 'other'],
      required: true
    },

    // Estimated Time
    estimatedTime: {
      value: Number,
      unit: { type: String, enum: ['minutes', 'hours', 'days'], default: 'minutes' }
    },

    // Service Options
    hasOptions: {
      type: Boolean,
      default: false
    },
    options: [
      {
        name: String,
        choices: [String]
      }
    ],

    // Service Status
    isActive: {
      type: Boolean,
      default: true
    },
    isPopular: {
      type: Boolean,
      default: false
    },

    // Additional Info
    specifications: [String],
    maxFileSize: Number, // in MB
    allowedFormats: [String], // e.g., ['pdf', 'docx', 'jpg']
    minQuantity: {
      type: Number,
      default: 1
    },

    // Sort Order
    displayOrder: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Service = mongoose.model('Service', serviceSchema);

export default Service;

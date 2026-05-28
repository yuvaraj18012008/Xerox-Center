import mongoose from 'mongoose';

const supportTicketSchema = new mongoose.Schema(
  {
    // Ticket ID
    ticketId: {
      type: String,
      unique: true
    },

    // User Reference
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userEmail: String,
    userPhone: String,

    // Ticket Details
    subject: {
      type: String,
      required: true,
      maxlength: 200
    },
    category: {
      type: String,
      enum: ['order_issue', 'payment_issue', 'account_issue', 'technical_issue', 'feedback', 'complaint'],
      required: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },

    // Description
    description: {
      type: String,
      required: true
    },
    attachments: [
      {
        fileName: String,
        fileUrl: String,
        uploadedAt: Date
      }
    ],

    // Order Reference (if applicable)
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },

    // Status
    status: {
      type: String,
      enum: ['open', 'in_progress', 'waiting_customer', 'resolved', 'closed'],
      default: 'open'
    },

    // Responses/Thread
    responses: [
      {
        respondentType: {
          type: String,
          enum: ['customer', 'support', 'admin']
        },
        respondentId: mongoose.Schema.Types.ObjectId,
        respondentName: String,
        message: String,
        isInternal: Boolean, // Internal admin notes
        attachments: [String],
        respondedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    // Resolution
    resolution: {
      notes: String,
      resolvedAt: Date,
      resolvedBy: mongoose.Schema.Types.ObjectId
    },

    // Satisfaction
    satisfactionRating: {
      type: Number,
      min: 1,
      max: 5
    },
    satisfactionComment: String
  },
  {
    timestamps: true
  }
);

// Pre-save middleware for ticket ID generation
supportTicketSchema.pre('save', async function (next) {
  if (!this.ticketId) {
    const count = await mongoose.model('SupportTicket').countDocuments();
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    this.ticketId = `TKT-${dateStr}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);

export default SupportTicket;

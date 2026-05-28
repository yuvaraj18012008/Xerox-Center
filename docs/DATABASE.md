// Database Schema Documentation
# MongoDB Database Schema

## Collections and Relationships

### 1. Users Collection
```
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique),
  phone: String (10 digits),
  password: String (hashed),
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  role: 'customer' | 'admin',
  isActive: Boolean,
  isVerified: Boolean,
  profileImage: String,
  totalOrders: Number,
  totalSpent: Number,
  loyaltyPoints: Number,
  preferences: {
    language: 'en' | 'ta',
    darkMode: Boolean,
    emailNotifications: Boolean,
    smsNotifications: Boolean
  },
  savedAddresses: [{
    label: String,
    address: String,
    isDefault: Boolean
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Services Collection
```
{
  _id: ObjectId,
  name: String,
  description: String,
  basePrice: Number,
  currency: String,
  icon: String,
  image: String,
  category: 'xerox'|'printing'|'scanning'|'binding'|'lamination'|'photos'|'forms'|'other',
  estimatedTime: {
    value: Number,
    unit: 'minutes'|'hours'|'days'
  },
  hasOptions: Boolean,
  options: [{
    name: String,
    choices: [String]
  }],
  isActive: Boolean,
  isPopular: Boolean,
  specifications: [String],
  maxFileSize: Number,
  allowedFormats: [String],
  minQuantity: Number,
  displayOrder: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Orders Collection
```
{
  _id: ObjectId,
  orderId: String (unique),
  customerId: ObjectId (ref: User),
  customerEmail: String,
  customerPhone: String,
  items: [{
    serviceId: ObjectId (ref: Service),
    serviceName: String,
    quantity: Number,
    printOptions: {
      type: 'BW'|'Color',
      paperSize: 'A4'|'A3'|'A5'|'Letter',
      sides: 'Single'|'Double',
      orientation: 'Portrait'|'Landscape',
      pageRange: String
    },
    fileName: String,
    fileUrl: String,
    fileSize: Number,
    uploadedAt: Date,
    unitPrice: Number,
    itemTotal: Number,
    specialInstructions: String
  }],
  subtotal: Number,
  discount: Number,
  discountCode: String,
  tax: Number,
  deliveryFee: Number,
  totalAmount: Number,
  currency: String,
  deliveryType: 'pickup'|'delivery',
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  pickupTime: Date,
  status: 'pending'|'accepted'|'printing'|'ready'|'delivered'|'cancelled',
  statusHistory: [{
    status: String,
    timestamp: Date,
    notes: String,
    updatedBy: ObjectId
  }],
  paymentStatus: 'pending'|'completed'|'failed'|'refunded',
  paymentMethod: 'cash'|'upi'|'card'|'qrcode'|'wallet',
  transactionId: String,
  paymentDetails: {
    gatewayReference: String,
    timestamp: Date,
    method: String
  },
  orderDate: Date,
  expectedDelivery: Date,
  actualDelivery: Date,
  internalNotes: String,
  customerNotes: String,
  assignedTo: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Payments Collection
```
{
  _id: ObjectId,
  orderId: ObjectId (ref: Order),
  orderIdString: String,
  customerId: ObjectId (ref: User),
  amount: Number,
  currency: String,
  method: 'cash'|'upi'|'card'|'qrcode'|'wallet'|'bank_transfer',
  gateway: 'razorpay'|'stripe'|'none',
  transactionId: String (unique),
  referenceId: String,
  gatewayResponse: Mixed,
  status: 'pending'|'processing'|'success'|'failed'|'cancelled'|'refunded',
  upiId: String,
  upiTransactionId: String,
  cardLast4: String,
  cardBrand: String,
  isRefunded: Boolean,
  refundAmount: Number,
  refundDetails: {
    reason: String,
    requestedAt: Date,
    processedAt: Date,
    refundId: String
  },
  initiatedAt: Date,
  completedAt: Date,
  expiresAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 5. Discounts Collection
```
{
  _id: ObjectId,
  code: String (uppercase, unique),
  description: String,
  discountType: 'percentage'|'fixed',
  discountValue: Number,
  maxDiscountAmount: Number,
  startDate: Date,
  endDate: Date,
  minimumOrderValue: Number,
  applicableOn: 'all'|'specific_services'|'first_order',
  applicableServices: [ObjectId],
  maxUsagePerUser: Number,
  totalUsageLimit: Number,
  totalUsed: Number,
  isActive: Boolean,
  usedBy: [{
    userId: ObjectId,
    usedAt: Date,
    orderId: ObjectId
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### 6. Reviews Collection
```
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  orderId: ObjectId (ref: Order),
  serviceId: ObjectId (ref: Service),
  rating: 1|2|3|4|5,
  title: String,
  comment: String,
  deliveryRating: Number,
  qualityRating: Number,
  priceRating: Number,
  supportRating: Number,
  images: [String],
  isVerified: Boolean,
  isPublished: Boolean,
  isHelpful: Number,
  adminResponse: {
    message: String,
    respondedAt: Date,
    respondedBy: ObjectId
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 7. Support Tickets Collection
```
{
  _id: ObjectId,
  ticketId: String (unique),
  userId: ObjectId (ref: User),
  userEmail: String,
  userPhone: String,
  subject: String,
  category: 'order_issue'|'payment_issue'|'account_issue'|'technical_issue'|'feedback'|'complaint',
  priority: 'low'|'medium'|'high'|'urgent',
  description: String,
  attachments: [{
    fileName: String,
    fileUrl: String,
    uploadedAt: Date
  }],
  orderId: ObjectId (ref: Order),
  status: 'open'|'in_progress'|'waiting_customer'|'resolved'|'closed',
  responses: [{
    respondentType: 'customer'|'support'|'admin',
    respondentId: ObjectId,
    respondentName: String,
    message: String,
    isInternal: Boolean,
    attachments: [String],
    respondedAt: Date
  }],
  resolution: {
    notes: String,
    resolvedAt: Date,
    resolvedBy: ObjectId
  },
  satisfactionRating: 1-5,
  satisfactionComment: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Indexes for Performance

```javascript
// Users
db.users.createIndex({ "email": 1 });
db.users.createIndex({ "phone": 1 });
db.users.createIndex({ "role": 1 });

// Orders
db.orders.createIndex({ "orderId": 1 });
db.orders.createIndex({ "customerId": 1 });
db.orders.createIndex({ "status": 1 });
db.orders.createIndex({ "paymentStatus": 1 });
db.orders.createIndex({ "orderDate": -1 });

// Payments
db.payments.createIndex({ "orderId": 1 });
db.payments.createIndex({ "customerId": 1 });
db.payments.createIndex({ "transactionId": 1 });
db.payments.createIndex({ "status": 1 });

// Services
db.services.createIndex({ "name": 1 });
db.services.createIndex({ "category": 1 });
db.services.createIndex({ "isActive": 1 });

// Discounts
db.discounts.createIndex({ "code": 1 });
db.discounts.createIndex({ "startDate": 1, "endDate": 1 });
```

## Relationships

- **Users → Orders**: One-to-Many (customerId)
- **Users → Payments**: One-to-Many (customerId)
- **Users → Reviews**: One-to-Many (userId)
- **Users → SupportTickets**: One-to-Many (userId)
- **Services → OrderItems**: One-to-Many (serviceId in items)
- **Services → Reviews**: One-to-Many (serviceId)
- **Orders → Payments**: One-to-One (orderId)
- **Orders → Reviews**: One-to-One (orderId)
- **Orders → SupportTickets**: One-to-Many (orderId)
- **Discounts → Orders**: One-to-Many (through discountCode)

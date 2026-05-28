// Order routes
import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/errorHandler.js';
import { authenticate } from '../middleware/auth.js';
import { db, isFirebaseAdminInitialized } from '../config/firebase.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// @route POST /api/orders
// @desc Create new order with file upload
// @access Private
router.post('/', authenticate, upload.array('files', 10), asyncHandler(async (req, res) => {
  const {
    service,
    paperSize,
    colorMode,
    copies,
    sided,
    bindingType,
    notes,
    phone,
    estimatedPrice,
    priceBreakdown
  } = req.body;

  const uploadedFiles = req.files;

  if (!service || !uploadedFiles || uploadedFiles.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Service and at least one file are required'
    });
  }

  const parsedPrice = parseFloat(estimatedPrice) || 0;
  const parsedCopies = parseInt(copies) || 1;

  // Get user info
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  // Build file info with actual server paths
  const fileData = uploadedFiles.map((file) => ({
    name: file.originalname,
    size: file.size,
    path: file.path.replace(/\\/g, '/'),
    url: `/uploads/orders/${req.user.id}/${file.filename}`,
    mimetype: file.mimetype
  }));

  // Map to Order model items
  const items = fileData.map((file) => ({
    serviceName: service,
    quantity: parsedCopies,
    printOptions: {
      type: colorMode === 'color' ? 'Color' : 'BW',
      paperSize: paperSize || 'A4',
      sides: sided === 'double' ? 'Double' : 'Single'
    },
    fileName: file.name,
    fileUrl: file.url,
    fileSize: file.size,
    uploadedAt: new Date(),
    unitPrice: parsedPrice / (fileData.length || 1),
    itemTotal: parsedPrice / (fileData.length || 1),
    specialInstructions: notes || ''
  }));

  // Create order
  const order = await Order.create({
    orderId: `XC-${Date.now()}`,
    customerId: req.user.id,
    customerEmail: user.email,
    customerPhone: phone || user.phone,
    items,
    subtotal: parsedPrice,
    totalAmount: parsedPrice,
    deliveryType: 'pickup',
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'cash',
    customerNotes: notes || '',
    statusHistory: [{
      status: 'pending',
      timestamp: new Date(),
      notes: 'Order placed by customer'
    }]
  });

  // Calculate estimated delivery
  order.calculateEstimatedDelivery();
  await order.save();

  // Update user order count
  user.totalOrders = (user.totalOrders || 0) + 1;
  user.totalSpent = (user.totalSpent || 0) + parsedPrice;
  await user.save();

  // Save order to Firebase Firestore
  if (isFirebaseAdminInitialized && db) {
    try {
      const firestoreOrder = {
        orderId: order.orderId,
        customerId: req.user.id,
        customerEmail: user.email,
        customerPhone: phone || user.phone || '',
        customerName: `${user.firstName} ${user.lastName}`,
        service,
        files: fileData.map(f => ({
          name: f.name,
          size: f.size,
          url: f.url,
          mimetype: f.mimetype
        })),
        specifications: {
          paperSize: paperSize || 'A4',
          colorMode: colorMode || 'bw',
          copies: parsedCopies,
          sided: sided || 'single',
          bindingType: bindingType || ''
        },
        subtotal: parsedPrice,
        totalAmount: parsedPrice,
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: 'cash',
        deliveryType: 'pickup',
        customerNotes: notes || '',
        orderDate: new Date().toISOString(),
        expectedDelivery: order.expectedDelivery ? order.expectedDelivery.toISOString() : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await db.collection('orders').doc(order.orderId).set(firestoreOrder);
      console.log(`Order ${order.orderId} saved to Firestore with ${fileData.length} file(s)`);
    } catch (firebaseError) {
      console.error('Failed to save order to Firestore:', firebaseError);
    }
  }

  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    data: {
      orderId: order.orderId,
      status: order.status,
      totalAmount: order.totalAmount,
      expectedDelivery: order.expectedDelivery,
      orderDate: order.orderDate,
      files: fileData.map(f => ({ name: f.name, url: f.url }))
    }
  });
}));

// @route GET /api/orders
// @desc Get all user orders
// @access Private
router.get('/', authenticate, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const orders = await Order.find({ customerId: req.user.id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('-internalNotes');

  const total = await Order.countDocuments({ customerId: req.user.id });

  res.status(200).json({
    success: true,
    data: orders,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

// @route GET /api/orders/track/:orderId
// @desc Track order (public)
// @access Public
router.get('/track/:orderId', asyncHandler(async (req, res) => {
  const order = await Order.findOne({ orderId: req.params.orderId })
    .select('orderId status statusHistory orderDate expectedDelivery items.serviceName totalAmount deliveryType');

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  res.status(200).json({
    success: true,
    data: order
  });
}));

// @route GET /api/orders/:orderId
// @desc Get order by ID
// @access Private
router.get('/:orderId', authenticate, asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    orderId: req.params.orderId,
    customerId: req.user.id
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  res.status(200).json({
    success: true,
    data: order
  });
}));

// @route PUT /api/orders/:orderId
// @desc Update order (only if pending)
// @access Private
router.put('/:orderId', authenticate, asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    orderId: req.params.orderId,
    customerId: req.user.id
  });

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  if (order.status !== 'pending') {
    return res.status(400).json({
      success: false,
      message: 'Can only update orders with pending status'
    });
  }

  const allowedUpdates = ['customerNotes', 'deliveryType', 'deliveryAddress'];
  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      order[field] = req.body[field];
    }
  });

  await order.save();

  // Sync update to Firestore
  if (isFirebaseAdminInitialized && db) {
    try {
      const updateData = { updatedAt: new Date().toISOString() };
      ['customerNotes', 'deliveryType', 'deliveryAddress'].forEach(field => {
        if (req.body[field] !== undefined) updateData[field] = req.body[field];
      });
      await db.collection('orders').doc(order.orderId).update(updateData);
    } catch (e) { console.error('Firestore update sync failed:', e); }
  }

  res.status(200).json({
    success: true,
    message: 'Order updated',
    data: order
  });
}));

// @route POST /api/orders/:orderId/cancel
// @desc Cancel order
// @access Private
router.post('/:orderId/cancel', authenticate, asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    orderId: req.params.orderId,
    customerId: req.user.id
  });

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  if (!['pending', 'accepted'].includes(order.status)) {
    return res.status(400).json({
      success: false,
      message: 'Can only cancel orders that are pending or accepted'
    });
  }

  await order.updateStatus('cancelled', 'Cancelled by customer', req.user.id);

  // Sync cancellation to Firestore
  if (isFirebaseAdminInitialized && db) {
    try {
      await db.collection('orders').doc(order.orderId).update({
        status: 'cancelled',
        updatedAt: new Date().toISOString()
      });
    } catch (e) { console.error('Firestore cancel sync failed:', e); }
  }

  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully',
    data: { orderId: order.orderId, status: order.status }
  });
}));

export default router;

# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authentication: Bearer <token>
```

## Response Format

All responses follow this format:
```json
{
  "success": true/false,
  "message": "Response message",
  "data": {} // Response data (if applicable)
}
```

---

## AUTH ENDPOINTS

### 1. User Registration
**POST** `/auth/register`

Request:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "token": "eyJhbGc...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "john@example.com",
      "role": "customer"
    }
  }
}
```

---

### 2. User Login
**POST** `/auth/login`

Request:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "customer"
    }
  }
}
```

---

## ORDER ENDPOINTS

### 1. Create New Order
**POST** `/orders`
**Auth Required:** Yes

Request:
```json
{
  "items": [
    {
      "serviceId": "507f1f77bcf86cd799439011",
      "quantity": 100,
      "printOptions": {
        "type": "BW",
        "paperSize": "A4",
        "sides": "Double",
        "orientation": "Portrait"
      },
      "specialInstructions": "Staple in sets of 10"
    }
  ],
  "deliveryType": "pickup",
  "pickupTime": "2024-05-27T14:00:00Z",
  "discountCode": "SAVE10"
}
```

Response:
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "orderId": "XC-20240527-00001",
    "status": "pending",
    "totalAmount": 500,
    "paymentRequired": true
  }
}
```

---

### 2. Get All Orders (User)
**GET** `/orders`
**Auth Required:** Yes

Query Parameters:
- `page` (default: 1)
- `limit` (default: 10)
- `status` (optional: pending, accepted, printing, ready, delivered, cancelled)

Response:
```json
{
  "success": true,
  "data": {
    "orders": [...],
    "pagination": {
      "total": 5,
      "page": 1,
      "totalPages": 1
    }
  }
}
```

---

### 3. Track Order
**GET** `/orders/track/:orderId`

Query Parameters:
- `phone` (alternative to orderId)

Response:
```json
{
  "success": true,
  "data": {
    "orderId": "XC-20240527-00001",
    "status": "printing",
    "statusHistory": [
      {
        "status": "pending",
        "timestamp": "2024-05-27T10:00:00Z",
        "notes": "Order received"
      },
      {
        "status": "accepted",
        "timestamp": "2024-05-27T10:15:00Z",
        "notes": "Order accepted"
      },
      {
        "status": "printing",
        "timestamp": "2024-05-27T10:30:00Z",
        "notes": "Printing started"
      }
    ],
    "expectedDelivery": "2024-05-27T14:00:00Z"
  }
}
```

---

### 4. Cancel Order
**POST** `/orders/:orderId/cancel`
**Auth Required:** Yes

Request:
```json
{
  "reason": "Changed my mind"
}
```

---

## SERVICE ENDPOINTS

### 1. Get All Services
**GET** `/services`

Response:
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Black & White Xerox",
      "basePrice": 5,
      "category": "xerox",
      "description": "Fast black and white xeroxing",
      "estimatedTime": {
        "value": 15,
        "unit": "minutes"
      },
      "isActive": true
    }
  ]
}
```

---

## PAYMENT ENDPOINTS

### 1. Initiate Payment
**POST** `/payments/initiate`
**Auth Required:** Yes

Request:
```json
{
  "orderId": "XC-20240527-00001",
  "amount": 500,
  "paymentMethod": "upi",
  "upiId": "user@upi"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "paymentId": "507f1f77bcf86cd799439011",
    "razorpayOrderId": "order_123...",
    "amount": 500,
    "status": "pending"
  }
}
```

---

### 2. Verify Payment
**POST** `/payments/:paymentId/verify`
**Auth Required:** Yes

Request:
```json
{
  "razorpayPaymentId": "pay_123...",
  "razorpayOrderId": "order_123...",
  "razorpaySignature": "sig_123..."
}
```

---

## USER ENDPOINTS

### 1. Get User Profile
**GET** `/users/profile`
**Auth Required:** Yes

Response:
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "address": {...},
    "totalOrders": 5,
    "totalSpent": 2500,
    "loyaltyPoints": 250
  }
}
```

---

### 2. Update User Profile
**PUT** `/users/profile`
**Auth Required:** Yes

Request:
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY"
  }
}
```

---

## ADMIN ENDPOINTS

All admin endpoints require `role: admin` and authentication.

### 1. Get Dashboard Stats
**GET** `/admin/stats`

Response:
```json
{
  "success": true,
  "data": {
    "totalOrders": 150,
    "totalRevenue": 75000,
    "totalCustomers": 50,
    "pendingOrders": 10,
    "todayRevenue": 5000,
    "averageOrderValue": 500
  }
}
```

---

### 2. Get All Orders (Admin)
**GET** `/admin/orders`

Query Parameters:
- `status`
- `dateFrom`
- `dateTo`
- `page`
- `limit`

---

### 3. Update Order Status
**PUT** `/admin/orders/:orderId`

Request:
```json
{
  "status": "printing",
  "notes": "Started at 2:30 PM"
}
```

---

### 4. Add New Service
**POST** `/admin/services`

Request:
```json
{
  "name": "A3 Color Xerox",
  "description": "Large format color copying",
  "basePrice": 10,
  "category": "xerox",
  "estimatedTime": {
    "value": 20,
    "unit": "minutes"
  }
}
```

---

## DISCOUNT ENDPOINTS

### 1. Validate Coupon Code
**POST** `/discounts/validate`

Request:
```json
{
  "code": "SAVE10",
  "orderAmount": 500
}
```

Response:
```json
{
  "success": true,
  "data": {
    "isValid": true,
    "discountType": "percentage",
    "discountValue": 10,
    "discountAmount": 50
  }
}
```

---

## ERROR RESPONSES

### Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Authentication Error
```json
{
  "success": false,
  "message": "Invalid token"
}
```

### Authorization Error
```json
{
  "success": false,
  "message": "Not authorized to access this resource"
}
```

---

## HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `422`: Validation Error
- `500`: Server Error

---

## Rate Limiting

- 100 requests per 15 minutes per IP address
- Additional limits for sensitive endpoints (login, payment)

---

## Pagination

Default pagination parameters:
```json
{
  "page": 1,
  "limit": 10,
  "total": 50,
  "totalPages": 5
}
```

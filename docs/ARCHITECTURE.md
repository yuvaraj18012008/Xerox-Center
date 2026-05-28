# Technology Stack & Architecture

## Architecture Overview

The Xerox Center website follows a modern three-tier architecture:

```
┌─────────────────────────────────────────────────────┐
│                  CLIENT LAYER                       │
│  React.js + Tailwind CSS + React Router + Zustand  │
│  (Frontend - Responsive Web Application)            │
└────────────────────────┬────────────────────────────┘
                         │
                    HTTP/REST API
                    (JSON Requests)
                         │
┌────────────────────────▼────────────────────────────┐
│               API/APPLICATION LAYER                  │
│     Express.js + Node.js + Middleware Stack         │
│     (Authentication, Validation, Business Logic)    │
└────────────────────────┬────────────────────────────┘
                         │
                    TCP Connection
                  (Mongoose ODM)
                         │
┌────────────────────────▼────────────────────────────┐
│                  DATA LAYER                         │
│        MongoDB (NoSQL Document Database)            │
│   Collections: Users, Orders, Services, Payments   │
└─────────────────────────────────────────────────────┘
```

## Frontend Stack

### Core Technologies
- **Framework**: React 18.2.0
- **Build Tool**: Vite (faster than Create React App)
- **Routing**: React Router DOM 6.x
- **Styling**: Tailwind CSS 3.3
- **HTTP Client**: Axios
- **State Management**: Zustand / Context API
- **Icons**: React Icons (5000+ icons)
- **Notifications**: React Hot Toast
- **Date Formatting**: date-fns

### Component Structure
```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── Card.jsx
│   ├── Modal.jsx
│   └── ...
├── pages/              # Page-level components
│   ├── Home.jsx
│   ├── Services.jsx
│   ├── OrderManagement.jsx
│   ├── Login.jsx
│   ├── AdminDashboard.jsx
│   └── ...
├── services/           # API communication
│   └── api.js         # Axios instance + API methods
├── hooks/              # Custom React hooks
├── context/            # Context API providers
├── styles/             # Global styles
├── assets/             # Images, fonts
└── utils/              # Helper functions
```

### Development Features
- Hot Module Replacement (HMR)
- Component lazy loading
- CSS-in-JS with Tailwind
- Mobile-first responsive design
- Dark mode support
- Accessibility features

## Backend Stack

### Core Technologies
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18
- **Database**: MongoDB 6.x + Mongoose 8.x (ODM)
- **Authentication**: JWT (Jason Web Token)
- **Password Security**: bcryptjs
- **File Upload**: Multer
- **Async Handling**: express-async-errors
- **Validation**: express-validator
- **Security**: Helmet.js
- **Email**: Nodemailer
- **Real-time**: Socket.io (for chat/notifications)
- **Payment**: Razorpay SDK

### Project Structure
```
backend/
├── src/
│   ├── server.js                # Entry point
│   ├── controllers/             # Business logic
│   │   ├── authController.js
│   │   ├── orderController.js
│   │   ├── serviceController.js
│   │   └── ...
│   ├── models/                  # MongoDB schemas
│   │   ├── User.js
│   │   ├── Order.js
│   │   ├── Service.js
│   │   ├── Payment.js
│   │   └── ...
│   ├── routes/                  # API endpoints
│   │   ├── authRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── serviceRoutes.js
│   │   └── ...
│   ├── middleware/              # Custom middleware
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── services/                # Business services
│   │   ├── emailService.js
│   │   ├── paymentService.js
│   │   └── ...
│   ├── utils/                   # Utilities
│   │   ├── helpers.js
│   │   └── errorHandler.js
│   └── config/                  # Configuration
│       └── database.js
├── uploads/                     # File uploads storage
├── package.json
├── .env.example
└── Dockerfile
```

## Database Schema (MongoDB)

### Collections
1. **Users** - Customer and admin accounts
2. **Services** - Xerox/printing services offered
3. **Orders** - Customer orders
4. **Payments** - Payment transactions
5. **Discounts** - Coupon codes and discounts
6. **Reviews** - Customer reviews and ratings
7. **SupportTickets** - Support ticket management

### Relationships
- Users → Orders (1-to-Many)
- Users → Payments (1-to-Many)
- Services → Orders/Items (1-to-Many)
- Orders → Payments (1-to-1)
- Orders → Reviews (1-to-1)

## Authentication Flow

```
1. User Registration
   │
   ├─ User submits credentials
   ├─ Validate input
   ├─ Hash password with bcrypt
   ├─ Save to MongoDB
   └─ Return JWT token

2. User Login
   │
   ├─ User provides email/password
   ├─ Find user in database
   ├─ Compare passwords
   ├─ Generate JWT token
   └─ Return token + user data

3. Protected Routes
   │
   ├─ Client sends request with token
   ├─ Middleware verifies token
   ├─ Extract user info from token
   └─ Allow access to resource
```

## API Request/Response Flow

```
Request:
┌─────────────────────────────────────┐
│ Frontend (React)                    │
│ axios.post('/api/orders', data)     │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ Express Middleware Stack            │
│ ├─ CORS Check                       │
│ ├─ Body Parser                      │
│ ├─ Authentication                   │
│ ├─ Validation                       │
│ └─ Route Handler                    │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ Controller/Service Logic            │
│ ├─ Business Logic                   │
│ ├─ Database Queries (Mongoose)      │
│ └─ Response Preparation             │
└────────────┬────────────────────────┘
             │
             ▼
        MongoDB
             │
             ▼
┌─────────────────────────────────────┐
│ Response to Frontend                │
│ {                                   │
│   "success": true,                  │
│   "data": {...}                     │
│ }                                   │
└─────────────────────────────────────┘
```

## Security Measures

1. **Authentication**: JWT tokens with expiration
2. **Password Security**: Bcrypt hashing (10 rounds)
3. **CORS**: Configured for specific origins
4. **Helmet**: Security headers
5. **Validation**: Input validation on all endpoints
6. **Sanitization**: XSS prevention
7. **Rate Limiting**: Prevent brute force attacks
8. **HTTPS**: SSL/TLS encryption in production
9. **Environment Variables**: Secrets not in code
10. **MongoDB**: Authentication enabled

## Performance Optimizations

### Frontend
- Code splitting with React.lazy()
- Image optimization
- CSS minification
- JavaScript bundling with Vite
- Caching strategy
- Lazy loading of components

### Backend
- Database indexing on frequently queried fields
- Connection pooling
- Caching with Redis (optional)
- Pagination for large datasets
- Compression middleware
- API response optimization

### Infrastructure
- Docker containerization
- Load balancing
- CDN for static assets
- Database replication
- Horizontal scaling capability

## Development Workflow

1. **Feature Development**
   - Create feature branch
   - Develop on local machine
   - Test thoroughly
   - Commit with descriptive messages

2. **Code Quality**
   - Linting (ESLint)
   - Formatting (Prettier)
   - Unit tests
   - Integration tests

3. **Deployment**
   - Docker build
   - Push to registry
   - Deploy to cloud platform
   - Monitor and debug

## Deployment Architecture

```
GitHub Repository
       │
       ▼
CI/CD Pipeline (GitHub Actions)
       │
       ├─ Code Quality Checks
       ├─ Build Docker Images
       └─ Push to Registry
       │
       ▼
Cloud Provider (AWS/Heroku/DigitalOcean)
       │
       ├─ Backend Container (Node.js)
       ├─ Frontend Container (React/Nginx)
       └─ Database (MongoDB Atlas)
       │
       ▼
Load Balancer
       │
       ▼
CDN & Caching Layer
```

## Monitoring & Logging

- **Application Monitoring**: New Relic / Datadog
- **Error Tracking**: SentryIO
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Performance Monitoring**: APM tools
- **Health Checks**: Regular endpoint monitoring

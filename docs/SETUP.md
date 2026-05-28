# Complete Setup Guide

## Prerequisites

- **Node.js** v16 or higher
- **MongoDB** (Local or Atlas Cloud)
- **Git**
- **Docker** (optional, for containerized setup)
- **Postman** (for API testing)

## Local Development Setup

### Step 1: Clone or Extract Project

```bash
cd xerox-center-website
```

### Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Important environment variables to set:**
```
MONGODB_URI=mongodb://admin:admin123@localhost:27017/xerox_db
JWT_SECRET=your_secret_key_here
PORT=5000
```

### Step 3: MongoDB Setup

#### Option A: Local MongoDB
```bash
# If using local MongoDB
mongod
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get connection string
5. Update MONGODB_URI in .env

### Step 4: Start Backend Server

```bash
# From backend directory
npm run dev
```

The backend should be running on http://localhost:5000

### Step 5: Frontend Setup

```bash
# From project root, navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env if needed (usually defaults are fine)
nano .env
```

### Step 6: Start Frontend Development Server

```bash
# From frontend directory
npm start
```

The frontend should be running on http://localhost:3000

## Docker Setup (Cloud-Ready)

### Prerequisites for Docker
- Docker Desktop installed
- Docker Compose installed

### Steps

1. **Build and run with Docker Compose:**
```bash
cd xerox-center-website
docker-compose up --build
```

2. **Access services:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

3. **Database connection:**
```
mongodb://admin:admin123@mongodb:27017/xerox_db?authSource=admin
```

4. **Stop services:**
```bash
docker-compose down
```

### Individual Container Commands

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Access MongoDB shell
docker exec -it xerox_mongodb mongosh -u admin -p admin123

# Rebuild specific service
docker-compose up --build backend
```

## Database Initialization

### Create Admin User

```bash
# Connect to MongoDB
mongosh mongodb://admin:admin123@localhost:27017

# Use xerox_db
use xerox_db

# Create admin user (will be created via script)
```

### Initialize Sample Data

```bash
# From backend directory
node scripts/seed.js
```

This will create:
- Admin user
- Sample services
- Sample discount codes

## API Testing

### Using Postman

1. Import the API collection from `docs/postman-collection.json`
2. Set up environment variables:
   - BASE_URL: http://localhost:5000
   - TOKEN: (will be set after login)

### Using cURL

```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "password": "password123"
  }'
```

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Or use MongoDB Atlas connection string
```

### Port Already in Use
```bash
# Kill process using port 5000
lsof -i :5000
kill -9 <PID>

# Kill process using port 3000
lsof -i :3000
kill -9 <PID>
```

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### CORS Issues
Check CORS_ORIGIN in backend .env matches your frontend URL

## Payment Gateway Setup

### Razorpay Setup
1. Create account at https://razorpay.com
2. Get API keys from dashboard
3. Add to .env:
```
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_secret_key
```

### Stripe Setup
1. Create account at https://stripe.com
2. Get API keys
3. Add to .env:
```
STRIPE_SECRET_KEY=your_secret_key
STRIPE_PUBLISHABLE_KEY=your_publishable_key
```

## Environment Checklist

- [ ] Node.js v16+ installed
- [ ] MongoDB running (local or Atlas)
- [ ] Backend .env configured
- [ ] Frontend .env configured
- [ ] Port 3000 available (frontend)
- [ ] Port 5000 available (backend)
- [ ] Port 27017 available (MongoDB)

## Next Steps

1. Test API endpoints via Postman
2. Test frontend login/register
3. Test order creation flow
4. Set up payment gateway
5. Configure email notifications
6. Deploy to cloud

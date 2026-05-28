# Quick Start Guide

## For Windows Users

### Prerequisites Installation

1. **Install Node.js**
   - Download from https://nodejs.org (v16 or higher)
   - Install with npm

2. **Install MongoDB**
   - Option A: MongoDB Community Edition
     - Download from https://www.mongodb.com/try/download/community
     - Install and run `mongod`
   
   - Option B: MongoDB Atlas (Cloud - Recommended)
     - Create account at https://www.mongodb.com/cloud/atlas
     - Create free cluster
     - Get connection string

3. **Install Docker (Optional but Recommended)**
   - Download Docker Desktop from https://www.docker.com/products/docker-desktop
   - Install and start Docker

### Quick Start - Without Docker

**Step 1: Open PowerShell/Command Prompt and navigate to project**
```powershell
cd "C:\Users\yuvar\OneDrive\Apps\new one\xerox-center-website"
```

**Step 2: Start MongoDB**
```powershell
# If using local MongoDB
mongod

# Or use MongoDB Atlas (just get connection string)
```

**Step 3: Setup Backend (In new terminal)**
```powershell
cd backend
npm install

# Create and edit .env file
Copy-Item .env.example .env
# Edit .env with your configuration

# Start backend
npm run dev
```

Backend should be running on: http://localhost:5000

**Step 4: Setup Frontend (In another new terminal)**
```powershell
cd frontend
npm install

# Create .env if needed
Copy-Item .env.example .env

# Start frontend
npm start
```

Frontend should be running on: http://localhost:3000

### Quick Start - With Docker

**Using Docker Compose (Easiest)**

```powershell
# Navigate to project
cd "C:\Users\yuvar\OneDrive\Apps\new one\xerox-center-website"

# Build and run
docker-compose up --build

# Access:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# MongoDB Admin: localhost:27017

# Stop
docker-compose down
```

## Testing the Application

### 1. Test Backend Health
```
GET http://localhost:5000/api/health
```

Expected Response:
```json
{
  "status": "OK",
  "message": "Xerox Center API is running"
}
```

### 2. Access Frontend
Open browser and go to: http://localhost:3000

You should see the Xerox Center homepage with:
- Navigation bar
- Hero section
- Services showcase
- Testimonials
- Call-to-action buttons

### 3. Test Features
- Click "Place Order" button
- Try navigation links
- Toggle dark mode
- Test responsive design (resize browser)

## Environment Configuration

### Backend .env Variables
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://admin:admin123@localhost:27017/xerox_db
JWT_SECRET=your_secret_key_here
```

### Frontend .env Variables
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Troubleshooting

### Port Already in Use
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <PID> /F

# Do the same for port 3000 if needed
```

### MongoDB Connection Failed
```powershell
# Check if MongoDB is running
# If using local MongoDB, open PowerShell as Admin and run:
mongod

# For MongoDB Atlas, verify connection string in .env
```

### Module Not Found
```powershell
# Clear and reinstall
cd backend
rm -r node_modules
npm install

# Same for frontend
cd ../frontend
rm -r node_modules
npm install
```

### CORS Error
- Check CORS_ORIGIN in backend .env
- Should include frontend URL (http://localhost:3000)

## Default Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend | 5000 | http://localhost:5000 |
| MongoDB | 27017 | mongodb://localhost:27017 |
| MongoDB Atlas | Cloud | Check connection string |

## File Structure Overview

```
xerox-center-website/
├── frontend/                    # React App
│   ├── src/
│   │   ├── pages/              # Page components
│   │   ├── components/         # Reusable components
│   │   ├── services/           # API services
│   │   └── App.jsx
│   └── package.json
├── backend/                     # Express Server
│   ├── src/
│   │   ├── models/             # MongoDB schemas
│   │   ├── routes/             # API routes
│   │   ├── controllers/        # Business logic
│   │   └── server.js
│   └── package.json
├── docs/                        # Documentation
├── docker-compose.yml
└── README.md
```

## Next Steps

1. **Explore Home Page**
   - See the beautiful landing page
   - Check responsive design

2. **Test Navigation**
   - Navigate to Services page
   - Check Order page
   - View Contact info

3. **Understand Structure**
   - Read DEVELOPMENT.md for roadmap
   - Check DATABASE.md for schema
   - Review API.md for endpoints

4. **Next Development Phase**
   - Implement authentication
   - Create order management
   - Setup payment system
   - Build admin dashboard

## Useful Commands

### Backend Development
```powershell
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Run tests
npm test
```

### Frontend Development
```powershell
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Preview production build
npm run preview
```

### Docker Commands
```powershell
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Access MongoDB shell
docker exec -it xerox_mongodb mongosh -u admin -p admin123
```

## Getting Help

1. **Check Documentation**
   - docs/SETUP.md - Detailed setup guide
   - docs/API.md - API documentation
   - docs/DATABASE.md - Database schema
   - docs/DEPLOYMENT.md - Deployment guide

2. **Common Issues**
   - See Troubleshooting section above

3. **Learning Resources**
   - React.js: https://react.dev
   - Express.js: https://expressjs.com
   - MongoDB: https://docs.mongodb.com
   - Tailwind CSS: https://tailwindcss.com

## Success Checklist

- [ ] Node.js installed (v16+)
- [ ] MongoDB running (local or Atlas)
- [ ] Backend installed and running on port 5000
- [ ] Frontend installed and running on port 3000
- [ ] Can see homepage in browser
- [ ] Dark mode toggle working
- [ ] Responsive design working
- [ ] Navigation links working
- [ ] Health endpoint responding

Once everything is working, you're ready to start developing features!

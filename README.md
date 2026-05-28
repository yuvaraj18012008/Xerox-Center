# Smart Xerox Center Management Website

A complete, professional web application for managing xerox/printing services with online ordering, payment integration, and order tracking.

## 🚀 Features

### Customer Features
- **Online Document Upload** - Upload PDF, DOCX, PPT, Images
- **Customizable Print Options** - Choose type, size, sides, orientation, copies
- **Real-time Pricing** - Instant cost calculation
- **Order Tracking** - Track orders with unique ID or phone number
- **User Authentication** - Secure registration and login
- **Order History** - View all previous orders and invoices
- **Multiple Payment Methods** - Cash, UPI, Cards, QR Code

### Admin Features
- **Admin Dashboard** - Complete business management system
- **Order Management** - View, update, and manage all orders
- **Service Management** - Add, edit, delete services and pricing
- **Customer Management** - View customer details and history
- **Sales Analytics** - Daily reports and business insights
- **File Management** - Download and manage uploaded documents

### Additional Features
- **Dark Mode** - Comfortable viewing in all lighting conditions
- **Multi-language** - English and Tamil support
- **Responsive Design** - Works perfectly on desktop, tablet, mobile
- **Live Chat Support** - Real-time customer assistance
- **WhatsApp Integration** - Direct messaging with customers
- **FAQ Section** - Self-service customer support
- **Referral System** - Encourage customer recommendations
- **Discount Coupons** - Promotional management

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios (HTTP client)
- React Router
- Context API / Redux
- File Upload Library

### Backend
- Node.js + Express.js
- MongoDB
- JWT Authentication
- Multer (File uploads)
- Stripe/Razorpay (Payments)
- Nodemailer (Email)
- Socket.io (Real-time Chat)

### Infrastructure
- Docker & Docker Compose
- MongoDB Atlas (Cloud Database)
- AWS S3 / Cloud Storage
- Heroku / AWS / DigitalOcean (Hosting)

## 📦 Project Structure

```
xerox-center-website/
├── frontend/                 # React application
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── assets/          # Images, icons
│   │   ├── styles/          # Global styles
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API services
│   │   ├── utils/           # Helper functions
│   │   ├── context/         # Context API
│   │   └── App.jsx
│   ├── package.json
│   └── tailwind.config.js
├── backend/                 # Express.js server
│   ├── controllers/         # Business logic
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── middleware/          # Authentication, validation
│   ├── services/            # Business services
│   ├── config/              # Configuration
│   ├── uploads/             # File uploads
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── docs/                    # Documentation
│   ├── DATABASE.md          # Database schema
│   ├── API.md               # API documentation
│   ├── SETUP.md             # Setup guide
│   └── DEPLOYMENT.md        # Deployment guide
├── docker-compose.yml       # Docker configuration
├── .env.example
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone or setup the project**
   ```bash
   cd xerox-center-website
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm start
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Access the application**
   - Customer: http://localhost:3000
   - Admin: http://localhost:3000/admin

## 🐳 Docker Setup (Cloud-Ready)

```bash
# Build and run with Docker Compose
docker-compose up --build

# Access services
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# MongoDB: localhost:27017
```

## 📚 Documentation

- [Database Schema](docs/DATABASE.md) - MongoDB collections and relationships
- [API Documentation](docs/API.md) - All endpoints and examples
- [Setup Guide](docs/SETUP.md) - Detailed installation steps
- [Deployment Guide](docs/DEPLOYMENT.md) - Deploy to cloud platforms

## 🔐 Security Features

- JWT-based authentication
- Password encryption with bcrypt
- File upload validation
- CORS configuration
- Rate limiting
- SQL injection protection
- Secure headers (Helmet.js)

## 📊 Performance

- Optimized images with compression
- Lazy loading for components
- Database indexing
- API response caching
- CDN-ready structure
- Code splitting

## 📱 Responsive Design

- Mobile-first approach
- Desktop, tablet, and mobile breakpoints
- Touch-friendly UI
- Fast mobile loading

## 🌐 Deployment

Ready to deploy on:
- Heroku
- AWS (EC2, Amplify)
- DigitalOcean
- Azure
- Google Cloud

## 📄 License

This project is proprietary software for Xerox Center business.

## 👥 Support

For issues and support, refer to the documentation or contact the development team.

---

**Status:** In Development
**Last Updated:** $(date)
**Version:** 1.0.0-alpha

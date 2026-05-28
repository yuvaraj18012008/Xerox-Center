import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'express-async-errors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the backend root .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

// Validate critical environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'JWT_EXPIRE'];
const missingEnvVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingEnvVars.length > 0) {
  console.error(`\n❌ FATAL: Missing required environment variables: ${missingEnvVars.join(', ')}`);
  console.error(`   Make sure your .env file exists at: ${path.join(__dirname, '../.env')}`);
  console.error(`   And contains all required variables.\n`);
  process.exit(1);
}

// Import routes
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
// import serviceRoutes from './routes/serviceRoutes.js';

// Import middleware
// import errorHandler from './middleware/errorHandler.js';
import { connectDB } from './config/database.js';

const app = express();

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        "https://apis.google.com",
        "https://www.gstatic.com",
        "https://www.googleapis.com",
        "https://accounts.google.com"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "blob:",
        "https://*.googleusercontent.com",
        "https://*.google.com"
      ],
      connectSrc: [
        "'self'",
        "https://*.googleapis.com",
        "https://*.google.com",
        "https://identitytoolkit.googleapis.com",
        "https://securetoken.googleapis.com",
        "https://www.googleapis.com",
        "https://accounts.google.com",
        "https://*.firebaseapp.com",
        "https://*.firebaseio.com",
        "wss://*.firebaseio.com"
      ],
      frameSrc: [
        "'self'",
        "https://accounts.google.com",
        "https://*.firebaseapp.com",
        "https://*.firebaseio.com"
      ],
      objectSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
})); // Security headers — configured for Firebase Auth compatibility
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Static files
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Xerox Center API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes (will be imported once created)
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
// app.use('/api/services', serviceRoutes);
// app.use('/api/admin', adminRoutes);

// Serve frontend static assets in production/build state
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  
  // Forward routing for SPA react pages
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
  console.log("Serving frontend files from: " + frontendDistPath);
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message || err);
  if (err.stack) {
    console.error('Stack:', err.stack);
  }
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Provide user-friendly messages for common errors
  let userMessage = message;
  if (statusCode === 500) {
    if (message.includes('secretOrPrivateKey')) {
      userMessage = 'Server configuration error. Please contact the administrator.';
    } else if (message.includes('ECONNREFUSED') || message.includes('MongoServerError')) {
      userMessage = 'Database connection error. Please try again later.';
    }
  }
  
  res.status(statusCode).json({
    success: false,
    message: userMessage,
    ...(process.env.NODE_ENV === 'development' && { error: message, stack: err.stack })
  });
});

// Connect to Database
connectDB();

// Server startup
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  🖨️  Xerox Center API Server          ║
╠════════════════════════════════════════╣
║  Server running on port ${PORT}          ║
║  Environment: ${process.env.NODE_ENV || 'development'}    ║
║  Database: ${process.env.MONGODB_URI?.substring(0, 30)}... ║
╚════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

export default app;

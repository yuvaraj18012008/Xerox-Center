// Authentication routes
import express from 'express';
import {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
  logout,
  changePassword,
  firebaseSync
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../utils/errorHandler.js';

const router = express.Router();

// @route POST /api/auth/register
// @desc Register a new user
// @access Public
router.post('/register', register);

// @route POST /api/auth/login
// @desc Login user
// @access Public
router.post('/login', login);

// @route POST /api/auth/firebase-sync
// @desc Sync Firebase user with MongoDB and issue JWT
// @access Public
router.post('/firebase-sync', firebaseSync);

// @route GET /api/auth/verify-email/:token
// @desc Verify email address
// @access Public
router.get('/verify-email/:token', verifyEmail);

// @route POST /api/auth/forgot-password
// @desc Request password reset
// @access Public
router.post('/forgot-password', forgotPassword);

// @route POST /api/auth/reset-password/:token
// @desc Reset password with token
// @access Public
router.post('/reset-password/:token', resetPassword);

// @route GET /api/auth/me
// @desc Get current user profile
// @access Private
router.get('/me', authenticate, getMe);

// @route POST /api/auth/logout
// @desc Logout user
// @access Private
router.post('/logout', authenticate, logout);

// @route POST /api/auth/change-password
// @desc Change user password
// @access Private
router.post('/change-password', authenticate, changePassword);

export default router;

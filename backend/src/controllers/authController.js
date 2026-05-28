import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from '../utils/errorHandler.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/emailService.js';
import crypto from 'crypto';
import { admin, isFirebaseAdminInitialized } from '../config/firebase.js';

/**
 * @desc Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
export const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, password, confirmPassword } = req.body;

  // Validation
  if (!firstName || !lastName || !email || !phone || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields'
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'Passwords do not match'
    });
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(409).json({
      success: false,
      message: 'Email already registered'
    });
  }

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password
  });

  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  user.verificationToken = verificationToken;
  user.verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  await user.save();

  // Send verification email
  try {
    await sendVerificationEmail(email, verificationToken);
  } catch (error) {
    console.error('Email send error:', error);
    // Still allow registration even if email fails
  }

  // Generate JWT token
  const token = user.getSignedJwtToken();

  res.status(201).json({
    success: true,
    message: 'User registered successfully. Please check your email to verify your account.',
    data: {
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    }
  });
});

/**
 * @desc Login user
 * @route POST /api/auth/login
 * @access Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }

  // Check for user (select password as it's hidden by default)
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check if account is active
  if (!user.isActive) {
    return res.status(403).json({
      success: false,
      message: 'Your account has been deactivated'
    });
  }

  // Check password
  const isPasswordMatch = await user.matchPassword(password);
  if (!isPasswordMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Generate token
  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    data: {
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified
      }
    }
  });
});

/**
 * @desc Verify email address
 * @route GET /api/auth/verify-email/:token
 * @access Public
 */
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  // Find user by token
  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired verification token'
    });
  }

  // Mark as verified
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Email verified successfully. You can now login.'
  });
});

/**
 * @desc Forgot password - Send reset email
 * @route POST /api/auth/forgot-password
 * @access Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Please provide an email address'
    });
  }

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal if email exists for security
    return res.status(200).json({
      success: true,
      message: 'If email exists, password reset link has been sent'
    });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save();

  try {
    await sendPasswordResetEmail(email, resetToken);
  } catch (error) {
    console.error('Email send error:', error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return res.status(500).json({
      success: false,
      message: 'Error sending password reset email'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Password reset email sent successfully'
  });
});

/**
 * @desc Reset password with token
 * @route POST /api/auth/reset-password/:token
 * @access Public
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  // Validation
  if (!password || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'Please provide password and confirm password'
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'Passwords do not match'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters'
    });
  }

  // Find user by reset token
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired reset token'
    });
  }

  // Update password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password reset successfully. You can now login with your new password.'
  });
});

/**
 * @desc Get current logged in user profile
 * @route GET /api/auth/me
 * @access Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 * @desc Logout user
 * @route POST /api/auth/logout
 * @access Private
 */
export const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

/**
 * @desc Change password
 * @route POST /api/auth/change-password
 * @access Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields'
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'New passwords do not match'
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 6 characters'
    });
  }

  // Get user with password
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  const isPasswordMatch = await user.matchPassword(currentPassword);
  if (!isPasswordMatch) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully'
  });
});

/**
 * @desc Sync Firebase session with MongoDB & issue backend JWT
 * @route POST /api/auth/firebase-sync
 * @access Public
 */
export const firebaseSync = asyncHandler(async (req, res) => {
  const { token, email, uid, firstName, lastName, phone, isRegistering } = req.body;

  if (!token || !email) {
    return res.status(400).json({
      success: false,
      message: 'Please provide Firebase ID Token and email'
    });
  }

  let verifiedEmail = email;

  // Verify Firebase Token if Admin SDK is configured
  if (isFirebaseAdminInitialized) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      verifiedEmail = decodedToken.email || email;
    } catch (error) {
      console.error("Firebase ID Token verification failed:", error.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid Firebase ID Token'
      });
    }
  } else {
    console.warn("Bypassing Firebase Token verification (dev/fallback mode).");
  }

  try {
    // Find user by email
    let user = await User.findOne({ email: verifiedEmail.toLowerCase() });

    if (!user) {
      // Determine info from payload or generate defaults
      const cleanFirstName = firstName || verifiedEmail.split('@')[0];
      const cleanLastName = lastName || 'User';
      const cleanPhone = (phone && phone.replace(/\D/g, '').slice(-10)) || '9876543210';
      
      // Satisfy required schema fields
      const dummyPassword = crypto.randomBytes(16).toString('hex') + 'Aa1!';

      user = await User.create({
        firstName: cleanFirstName,
        lastName: cleanLastName,
        email: verifiedEmail.toLowerCase(),
        phone: cleanPhone.length === 10 ? cleanPhone : '9876543210',
        password: dummyPassword,
        isVerified: true
      });
    } else if (isRegistering) {
      // Update existing user properties if registering
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (phone) {
        const cleanPhone = phone.replace(/\D/g, '').slice(-10);
        if (cleanPhone.length === 10) user.phone = cleanPhone;
      }
      await user.save();
    }

    // Generate JWT token for backend authorization
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not configured in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error. Please contact the administrator.'
      });
    }

    const jwtToken = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      message: 'User session synchronized successfully',
      data: {
        token: jwtToken,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isVerified: user.isVerified
        }
      }
    });
  } catch (error) {
    console.error('Firebase sync - Database/JWT error:', error.message);
    
    // Handle specific mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    // Handle duplicate key error (email already exists race condition)
    if (error.code === 11000) {
      // Retry finding the user since it was created between our check and insert
      const user = await User.findOne({ email: verifiedEmail.toLowerCase() });
      if (user) {
        const jwtToken = user.getSignedJwtToken();
        return res.status(200).json({
          success: true,
          message: 'User session synchronized successfully',
          data: {
            token: jwtToken,
            user: {
              id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phone: user.phone,
              role: user.role,
              isVerified: user.isVerified
            }
          }
        });
      }
    }
    
    throw error; // Re-throw for the global error handler
  }
});

export default {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
  logout,
  changePassword,
  firebaseSync
};

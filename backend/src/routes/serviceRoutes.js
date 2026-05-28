// Service routes
import express from 'express';
import { asyncHandler } from '../utils/errorHandler.js';

const router = express.Router();

// @route GET /api/services
// @desc Get all services
// @access Public
router.get('/', asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: []
  });
}));

// @route GET /api/services/:id
// @desc Get service by ID
// @access Public
router.get('/:id', asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {}
  });
}));

export default router;

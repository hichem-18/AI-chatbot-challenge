// middleware/authMiddleware.js
// JWT authentication middleware for protecting routes
// Validates JWT tokens and adds user info to request

import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

/**
 * Middleware to authenticate JWT tokens
 * Adds user info to req.user if token is valid
 */
export const authenticateToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Optional: Verify user still exists in database
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'email', 'language_preference']
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add user info to request
    req.user = {
      id: user.id,
      email: user.email,
      language_preference: user.language_preference
    };

    next();

  } catch (error) {
    console.error('Auth middleware error:', error);

    // Handle different JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

/**
 * Optional middleware for routes that work with or without authentication
 * Adds user info if token is provided, but doesn't require it
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    if (!token) {
      // No token provided, continue without user info
      req.user = null;
      return next();
    }

    // Verify token if provided
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'email', 'language_preference']
    });

    req.user = user ? {
      id: user.id,
      email: user.email,
      language_preference: user.language_preference
    } : null;

    next();

  } catch (error) {
    // If token is invalid, continue without user info
    req.user = null;
    next();
  }
};

export default {
  authenticateToken,
  optionalAuth
};
// routes/authRoutes.js
// Authentication routes for signup, login, logout, and user info
// Uses JWT for authentication and authorization

import express from 'express';
import { signup, login, logout, getMe } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/auth/signup - Register new user
router.post('/signup', signup);

// POST /api/auth/login - Login user
router.post('/login', login);

// POST /api/auth/logout - Logout user
router.post('/logout', logout);

// GET /api/auth/me - Get current user info (protected route)
router.get('/me', authenticateToken, getMe);

export default router;
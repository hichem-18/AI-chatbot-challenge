// /api/auth.js
// Authentication API endpoint for Vercel
import { signup, login, logout, getMe } from '../backend/controllers/authController.js';
import { authenticateToken } from '../backend/middleware/authMiddleware.js';

// Enable CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://ai-chatbot-challenge-i2a1.vercel.app',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true'
};

export default async function handler(req, res) {
  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { method, query } = req;
    const action = query.action;

    switch (`${method}:${action}`) {
      case 'POST:signup':
        return await signup(req, res);
      
      case 'POST:login':
        return await login(req, res);
      
      case 'POST:logout':
        return await logout(req, res);
      
      case 'GET:me':
        // Apply auth middleware for protected routes
        return await authenticateToken(req, res, () => getMe(req, res));
      
      default:
        res.status(404).json({ 
          error: 'Auth endpoint not found',
          available: ['signup', 'login', 'logout', 'me'],
          usage: '/api/auth?action=login'
        });
    }
  } catch (error) {
    console.error('Auth API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
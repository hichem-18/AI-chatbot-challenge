// /api/auth.js

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const corsHeaders = {
  'Access-Control-Allow-Origin': FRONTEND_URL,
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true'
};

export default async function handler(req, res) {
  // Apply headers
  Object.entries(corsHeaders).forEach(([key, value]) => res.setHeader(key, value));

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
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
        return await authenticateToken(req, res, () => getMe(req, res));
      default:
        return res.status(404).json({
          error: 'Auth endpoint not found',
          available: ['signup', 'login', 'logout', 'me'],
          usage: '/api/auth?action=login'
        });
    }
  } catch (error) {
    console.error('Auth API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

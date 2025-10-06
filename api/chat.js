// /api/chat.js
// Chat API endpoint for Vercel
import { 
  sendMessage, 
  sendSimpleMessage,
  createNewConversation,
  getUserConversations, 
  getConversationHistory,
  getAllChatHistory,
  getUserSummary,
  deleteConversation 
} from '../backend/controllers/chatController.js';
import { authenticateToken } from '../backend/middleware/authMiddleware.js';

// Dynamic CORS configuration
const getAllowedOrigin = () => {
  // In production: use FRONTEND_URL from environment
  // In development: allow localhost origins
  return process.env.FRONTEND_URL || 
         process.env.NODE_ENV === 'production' 
           ? process.env.FRONTEND_URL 
           : 'http://localhost:5173';
};

// Enable CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': getAllowedOrigin(),
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

  // All chat endpoints require authentication
  return authenticateToken(req, res, async () => {
    try {
      const { method, query } = req;
      const action = query.action;

      switch (`${method}:${action}`) {
        case 'POST:message':
          return await sendMessage(req, res);
        
        case 'POST:simple-message':
          return await sendSimpleMessage(req, res);
        
        case 'POST:new-conversation':
          return await createNewConversation(req, res);
        
        case 'GET:conversations':
          return await getUserConversations(req, res);
        
        case 'GET:history':
          return await getConversationHistory(req, res);
        
        case 'GET:all-history':
          return await getAllChatHistory(req, res);
        
        case 'GET:summary':
          return await getUserSummary(req, res);
        
        case 'DELETE:conversation':
          return await deleteConversation(req, res);
        
        default:
          res.status(404).json({ 
            error: 'Chat endpoint not found',
            available: ['message', 'simple-message', 'new-conversation', 'conversations', 'history', 'all-history', 'summary'],
            usage: '/api/chat?action=message'
          });
      }
    } catch (error) {
      console.error('Chat API Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}
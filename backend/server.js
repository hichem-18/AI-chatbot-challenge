// server.js
// Minimal Express.js server setup for the chatbot backend
// Features: dotenv for environment variables, CORS, express.json middleware, and basic route structure

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './configs/database.js';
import { User, ChatHistory, UserSummary } from './models/index.js';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Chatbot backend is running');
});

// Database connection test endpoint
app.get('/api/db', async (req, res) => {
  try {
    await testConnection();
    
    // Test if models are accessible
    const userCount = await User.count();
    const chatCount = await ChatHistory.count();
    const summaryCount = await UserSummary.count();
    
    res.json({
      status: 'connected',
      message: 'Database connection successful',
      tables: {
        users: userCount,
        chat_history: chatCount,
        user_summaries: summaryCount
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Test database connection on startup
const startServer = async () => {
  try {
    await testConnection();
    console.log('✅ Database connected successfully');
    
    // Sync database tables (create if they don't exist)
    console.log('🔄 Syncing database tables...');
    const { sequelize } = await import('./models/index.js');
    await sequelize.sync({ alter: false }); // Don't alter existing tables, just create missing ones
    console.log('✅ Database tables synchronized');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
      console.log(`📊 Database health check: http://localhost:${PORT}/api/health/db`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    console.error('🔧 Please run: node syncDatabase.js');
    process.exit(1);
  }
};

startServer();
/*
Documentation:
- Environment variables are loaded from a .env file (create one in backend/ if needed)
- Add route handlers in routes/auth.js, routes/chat.js, routes/user.js
- Use express.json() for JSON APIs
- CORS is enabled for all origins
*/

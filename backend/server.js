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

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:8000',
    'https://ai-chatbot-challenge-frontend.onrender.com',
    'https://ai-chatbot-challenge-i2a1.vercel.app' // Your existing Vercel deployment
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Middleware
app.use(cors(corsOptions)); // Enable CORS with configuration
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
  console.log('\n🚀 Starting AI Chatbot Backend Server...');
  console.log('=' .repeat(50));
  
  try {
    // Log environment configuration
    console.log('📊 Environment Configuration:');
    console.log(`   • NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   • PORT: ${PORT}`);
    console.log(`   • Database: ${process.env.NODE_ENV === 'production' ? 'PostgreSQL' : 'SQLite'}`);
    
    // Step 1: Test database connection
    console.log('\n🔌 Step 1: Testing database connection...');
    await testConnection();
    console.log('✅ Database connection established successfully');
    
    // Step 2: Import and sync models
    console.log('\n📋 Step 2: Importing database models...');
    const { sequelize } = await import('./models/index.js');
    console.log('✅ Database models imported successfully');
    
    console.log('\n🔄 Step 3: Syncing database tables...');
    await sequelize.sync({ alter: false }); // Don't alter existing tables, just create missing ones
    console.log('✅ Database tables synchronized successfully');
    
    // Step 4: Start Express server
    console.log('\n🌐 Step 4: Starting Express server...');
    app.listen(PORT, () => {
      console.log('✅ Express server started successfully');
      console.log('=' .repeat(50));
      console.log(`🎉 AI Chatbot Backend Server is running!`);
      console.log(`📡 Server URL: http://localhost:${PORT}`);
      console.log(`🗄️  Database: ${process.env.NODE_ENV === 'production' ? 'PostgreSQL (Production)' : 'SQLite (Development)'}`);
      console.log(`🕒 Started at: ${new Date().toLocaleString()}`);
      console.log('=' .repeat(50));
    });
    
  } catch (error) {
    console.log('\n❌ SERVER STARTUP FAILED');
    console.log('=' .repeat(50));
    console.error('💥 Fatal Error Details:');
    console.error(`   • Message: ${error.message}`);
    console.error(`   • Name: ${error.name}`);
    console.error(`   • Code: ${error.code || 'N/A'}`);
    
    if (error.stack) {
      console.error('\n📋 Full Stack Trace:');
      console.error(error.stack);
    }
    
    if (error.original) {
      console.error('\n🔍 Original Error:');
      console.error(error.original);
    }
    
    console.log('=' .repeat(50));
    console.error('🚨 Server startup failed. Exiting process...');
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

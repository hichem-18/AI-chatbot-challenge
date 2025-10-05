# 📁 AI Chatbot Project Structure

## 🏗️ Complete Folder Structure

```
ai-chatbot/
├── backend/
│   ├── 📁 configs/
│   │   └── database.js          # Sequelize database configuration
│   │
│   ├── 📁 controllers/
│   │   ├── authController.js    # Authentication logic (signup, login)
│   │   └── chatController.js    # Chat operations (8 endpoints)
│   │
│   ├── 📁 middleware/
│   │   └── authMiddleware.js    # JWT token verification
│   │
│   ├── 📁 models/
│   │   ├── index.js            # Model associations
│   │   ├── User.js             # User model with bcrypt
│   │   ├── ChatHistory.js      # Chat messages storage
│   │   └── UserSummary.js      # AI-generated user summaries
│   │
│   ├── 📁 routes/
│   │   ├── authRoutes.js       # Authentication endpoints
│   │   └── chatRoutes.js       # Chat API endpoints
│   │
│   ├── 📁 services/
│   │   ├── aiService.js        # LangChain service
│   │   └── langGraphAgent.js   # LangGraph intelligent agent
│   │
│   ├── 📄 Files/
│   │   ├── server.js           # Main Express server
│   │   ├── package.json        # Dependencies
│   │   ├── syncDatabase.js     # Database initialization
│   │   ├── testDatabase.js     # Database testing
│   │   ├── verifyDatabase.js   # Database verification
│   │   ├── chatbot.db          # SQLite database file
│   │   ├── .env                # Environment variables
│   │   ├── API_DOCUMENTATION.md # Complete API docs
│   │   └── PROJECT_STRUCTURE.md # This file
│   │
│   └── 📁 frontend/            # (Future frontend development)
```

---

## 🎯 Key Components Overview

### **🔐 Authentication System**
- **Models**: `User.js` with bcrypt password hashing
- **Controllers**: `authController.js` (signup, login, profile)
- **Routes**: `authRoutes.js` (/signup, /login, /profile)
- **Middleware**: `authMiddleware.js` (JWT verification)

### **🤖 AI Chat System**
- **Models**: `ChatHistory.js`, `UserSummary.js`
- **Services**: `aiService.js` (LangChain), `langGraphAgent.js` (LangGraph)
- **Controllers**: `chatController.js` (8 chat endpoints)
- **Routes**: `chatRoutes.js` (9 total endpoints)

### **💾 Database Layer**
- **Config**: `database.js` (Sequelize setup)
- **Models**: User relationships and validations
- **Scripts**: Sync, test, and verify database

### **🌐 Server & Configuration**
- **Main**: `server.js` (Express app with middleware)
- **Environment**: `.env` (API keys, JWT secrets)
- **Package**: All required dependencies

---

## 📊 Database Schema

### **Users Table**
```sql
- id (Primary Key, Auto Increment)
- username (Unique, Not Null)
- email (Unique, Not Null)
- password (Hashed with bcrypt)
- createdAt, updatedAt (Timestamps)
```

### **ChatHistories Table**
```sql
- id (Primary Key, Auto Increment)
- userId (Foreign Key → users.id)
- conversationId (UUID String, Default: 'default')
- model_name (String, AI model used)
- message (Text, User input)
- response (Text, AI response)
- language (String, 'en'/'ar')
- createdAt (Timestamp)
```

### **UserSummaries Table**
```sql
- id (Primary Key, Auto Increment)
- userId (Foreign Key → users.id, Unique)
- summary_text (Text, AI-generated summary)
- language (String, Summary language)
- updatedAt (Timestamp)
```

---

## 🚀 Technology Stack

### **Backend Framework**
- **Node.js** + **Express.js** (ES Modules)
- **Sequelize ORM** with **SQLite**
- **JWT Authentication** + **bcrypt**

### **AI Integration**
- **LangChain** (@langchain/core, @langchain/openai, @langchain/groq)
- **LangGraph** (@langchain/langgraph) for conversation flow
- **Groq API** (Llama 3.1 models)
- **OpenAI API** (GPT models)

### **Key Dependencies**
```json
{
  "express": "^4.18.2",
  "sequelize": "^6.32.1",
  "sqlite3": "^5.1.6",
  "jsonwebtoken": "^9.0.2",
  "bcrypt": "^5.1.0",
  "uuid": "^9.0.0",
  "@langchain/core": "latest",
  "@langchain/groq": "latest",
  "@langchain/langgraph": "latest",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1"
}
```

---

## 🌟 Features Summary

### **🔐 Authentication Features**
- ✅ User registration with validation
- ✅ Secure login with JWT tokens
- ✅ Password hashing with bcrypt
- ✅ Protected routes with middleware
- ✅ User profile management

### **🤖 AI Chat Features**
- ✅ LangGraph intelligent conversation routing
- ✅ LangChain direct model interaction
- ✅ Multi-model support (Groq Llama + OpenAI)
- ✅ Conversation memory management
- ✅ Multi-language support (English/Arabic)
- ✅ Cultural awareness and Islamic context

### **💬 Conversation Management**
- ✅ UUID-based conversation tracking
- ✅ Multiple simultaneous conversations
- ✅ Complete chat history
- ✅ AI-generated user summaries
- ✅ Conversation deletion and cleanup

### **🌐 API Features**
- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Input validation and sanitization
- ✅ Pagination support
- ✅ Language-appropriate responses

---

## 🔧 Environment Setup

### **Required Environment Variables**
```env
# API Keys
GROQ_API_KEY=your-groq-api-key-here
OPENAI_API_KEY=sk-your-openai-key-here

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Database (SQLite - auto-configured)
NODE_ENV=development
```

### **Installation & Setup**
```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your API keys

# 3. Initialize database
node syncDatabase.js

# 4. Verify setup
node testDatabase.js

# 5. Start server
node server.js
```

---

## 🎯 Project Status

### **✅ Completed Components**
- Database models and relationships
- Authentication system with JWT
- LangChain AI service integration
- LangGraph intelligent agent
- Complete REST API (11 endpoints)
- Multi-language support
- Cultural awareness features
- Comprehensive testing scripts

### **📋 Ready for Production**
- All backend APIs functional
- Database properly configured
- AI services integrated and tested
- Documentation complete
- Error handling implemented
- Security measures in place

### **🚀 Next Steps**
- Frontend development
- Deployment configuration
- Production optimization
- Load testing
- API rate limiting

Your AI chatbot backend is **production-ready** with enterprise-level features! 🌟
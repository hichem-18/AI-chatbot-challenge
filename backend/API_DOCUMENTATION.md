# 🤖 AI Chatbot API Documentation

## 📋 Overview
Complete Express.js chat system with advanced LangChain and LangGraph integration, featuring intelligent conversation routing, multi-language support, and cultural awareness.

## 🚀 Features

### 🧠 AI Capabilities
- **LangGraph Agent**: Intelligent intent routing (casual, technical, summary, help)
- **LangChain Integration**: Direct model interaction with memory management
- **Multi-Model Support**: Groq Llama 3.1 (8B/70B), OpenAI GPT-3.5/4
- **Conversation Memory**: Persistent memory per user/conversation

### 🌍 Language Support
- **English**: Natural, professional responses
- **Arabic**: Formal Arabic (Fusha) with cultural context and Islamic etiquette
- **Cultural Awareness**: Respectful terminology and cultural sensitivity

### 💾 Data Management
- **Conversation Tracking**: UUID-based conversation management
- **Chat History**: Complete message history with metadata
- **User Summaries**: AI-generated user interaction summaries
- **Memory Management**: LangChain memory with cleanup capabilities

---

## 🛣️ API Endpoints

### 1. **Send Message (LangGraph Agent)**
```http
POST /api/chat/message
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "Hello! How can I learn JavaScript?",
  "language": "en",
  "conversationId": "optional-uuid",
  "model_name": "langgraph-agent"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "conversationId": "uuid-here",
    "message": "Hello! How can I learn JavaScript?",
    "response": "I'd be happy to help you learn JavaScript! Here's a structured approach...",
    "model_name": "langgraph-agent",
    "language": "en",
    "createdAt": "2024-10-04T12:00:00Z",
    "agent_type": "langgraph"
  }
}
```

**Arabic Example:**
```json
{
  "message": "السلام عليكم، أريد تعلم البرمجة",
  "language": "ar"
}
```

### 2. **Send Simple Message (Direct LangChain)**
```http
POST /api/chat/simple
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "message": "What is Node.js?",
  "model_name": "llama-3.1-8b",
  "language": "en",
  "conversationId": "optional-uuid"
}
```

### 3. **Create New Conversation**
```http
POST /api/chat/new-conversation
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "title": "Learning JavaScript",
  "language": "en"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "conversationId": "uuid-generated",
    "title": "Learning JavaScript",
    "language": "en",
    "createdAt": "2024-10-04T12:00:00Z",
    "messageCount": 0
  }
}
```

### 4. **Get All Conversations**
```http
GET /api/chat/conversations?limit=20&offset=0
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "conversationId": "uuid-1",
      "title": "Learning JavaScript",
      "messageCount": 15,
      "lastActivity": "2024-10-04T12:00:00Z",
      "createdAt": "2024-10-04T10:00:00Z",
      "language": "en"
    }
  ],
  "total": 5,
  "pagination": {
    "limit": 20,
    "offset": 0
  }
}
```

### 5. **Get Conversation History**
```http
GET /api/chat/history/:conversationId?limit=50&offset=0&order=ASC
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "conversationId": "uuid-1",
    "messages": [
      {
        "id": 123,
        "model_name": "langgraph-agent",
        "message": "Hello!",
        "response": "Hi there! How can I help you today?",
        "language": "en",
        "createdAt": "2024-10-04T12:00:00Z",
        "conversationId": "uuid-1"
      }
    ],
    "total": 25,
    "pagination": {
      "limit": 50,
      "offset": 0,
      "order": "ASC"
    }
  }
}
```

### 6. **Get User Summary**
```http
GET /api/chat/summary?language=en
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "text": "User is interested in learning JavaScript and web development...",
      "language": "en",
      "updatedAt": "2024-10-04T12:00:00Z"
    },
    "statistics": {
      "totalMessages": 150,
      "totalConversations": 5,
      "arabicMessages": 20,
      "englishMessages": 130,
      "lastActivity": "2024-10-04T12:00:00Z"
    },
    "hasSummary": true
  }
}
```

### 7. **Delete Conversation**
```http
DELETE /api/chat/conversation/:conversationId
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "language": "en"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Conversation deleted successfully (25 messages)",
  "data": {
    "conversationId": "uuid-1",
    "deletedMessageCount": 25
  }
}
```

### 8. **Get Service Status**
```http
GET /api/chat/status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "apiKeys": {
      "openai": true,
      "groq": true,
      "hasAnyKey": true
    },
    "memoryStats": {
      "totalMemories": 5,
      "totalChains": 8
    },
    "graphStats": {
      "availableNodes": ["route_query", "respond_chat", "respond_technical", "generate_summary", "respond_help"],
      "supportedIntents": ["casual", "technical", "summary", "help"],
      "supportedLanguages": ["en", "ar"]
    },
    "availableModels": ["llama-3.1-8b", "llama-3.1-70b", "gpt-3.5-turbo", "gpt-4"],
    "supportedLanguages": ["en", "ar"],
    "agents": {
      "simple": "Basic LangChain conversation",
      "langgraph": "Advanced conversation flow with intent routing"
    }
  }
}
```

---

## 🎯 Intent Routing (LangGraph)

The LangGraph agent automatically detects user intent and routes to appropriate handlers:

### **Casual Intent**
- Greetings, small talk, general conversation
- **Arabic**: Uses Islamic greetings and respectful language
- **English**: Friendly and conversational

### **Technical Intent**
- Programming, development, technical questions
- **Arabic**: Uses Arabic technical terminology where possible
- **English**: Detailed explanations with code examples

### **Summary Intent**
- User requests conversation summary or history
- Auto-saves to UserSummary table
- Provides comprehensive analysis

### **Help Intent**
- System guidance and feature explanations
- **Arabic**: Formal assistance with cultural context
- **English**: Clear feature documentation

---

## 📊 Database Models

### **ChatHistory**
```sql
- id (Primary Key)
- userId (Foreign Key → users.id)
- conversationId (UUID, default: 'default')
- model_name (String)
- message (Text)
- response (Text)
- language (en/ar)
- createdAt (Timestamp)
```

### **UserSummary**
```sql
- id (Primary Key)
- userId (Foreign Key → users.id, Unique)
- summary_text (Text)
- language (en/ar)
- updatedAt (Timestamp)
```

---

## 🔧 Environment Variables

```env
# Required
GROQ_API_KEY=your-groq-key-here
OPENAI_API_KEY=sk-your-openai-key-here  # Optional

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h

# Database (SQLite - auto-configured)
NODE_ENV=development
```

---

## 🚀 Getting Started

1. **Install Dependencies:**
```bash
npm install
```

2. **Set Environment Variables:**
```bash
# Copy and edit .env file
cp .env.example .env
```

3. **Initialize Database:**
```bash
node syncDatabase.js
```

4. **Start Server:**
```bash
node server.js
```

5. **Test Endpoints:**
- Use Postman or similar tool
- First authenticate via `/api/auth/signup` or `/api/auth/login`
- Use returned JWT token in Authorization header

---

## 🌟 Key Features Highlights

- ✅ **Intelligent Routing**: Automatically detects conversation intent
- ✅ **Cultural Awareness**: Proper Arabic etiquette and Islamic context
- ✅ **Memory Management**: Persistent conversation context
- ✅ **Multi-Model Support**: Multiple AI models available
- ✅ **Conversation Management**: UUID-based conversation tracking
- ✅ **Error Handling**: Language-appropriate error messages
- ✅ **Scalable Architecture**: Controller-service pattern
- ✅ **Database Integration**: Complete chat history and summaries

Your AI chatbot is production-ready with enterprise-level features! 🎉
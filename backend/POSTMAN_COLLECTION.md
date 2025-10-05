# 🚀 Postman Collection for AI Chatbot API

## 📋 Complete API Testing Guide

### 🔧 **Postman Setup Instructions**

1. **Create New Collection**: "AI Chatbot API"
2. **Set Base URL Variable**: `{{baseUrl}}` = `http://localhost:3000`
3. **Create JWT Token Variable**: `{{jwtToken}}` (will be set after login)

---

## 🔐 **AUTHENTICATION REQUESTS**

### **1. User Signup**
```
Method: POST
URL: {{baseUrl}}/api/auth/signup
Headers: Content-Type: application/json

Body (JSON):
{
    "username": "testuser",
    "email": "test@example.com", 
    "password": "password123"
}

Expected Response:
{
    "success": true,
    "message": "User created successfully",
    "data": {
        "user": {
            "id": 1,
            "username": "testuser",
            "email": "test@example.com"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
```

### **2. User Login**
```
Method: POST
URL: {{baseUrl}}/api/auth/login
Headers: Content-Type: application/json

Body (JSON):
{
    "email": "test@example.com",
    "password": "password123"
}

Expected Response:
{
    "success": true,
    "message": "Login successful", 
    "data": {
        "user": {
            "id": 1,
            "username": "testuser",
            "email": "test@example.com"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}

⚠️ IMPORTANT: Copy the token from response and save as {{jwtToken}} variable!
```

### **3. Get User Profile**
```
Method: GET
URL: {{baseUrl}}/api/auth/me
Headers: 
- Authorization: Bearer {{jwtToken}}
- Content-Type: application/json

Expected Response:
{
    "success": true,
    "data": {
        "id": 1,
        "username": "testuser",
        "email": "test@example.com",
        "createdAt": "2024-10-04T10:00:00Z"
    }
}
```

---

## 🤖 **CHAT API REQUESTS**

### **4. Send Message (LangGraph Agent)**
```
Method: POST
URL: {{baseUrl}}/api/chat/message
Headers:
- Authorization: Bearer {{jwtToken}}
- Content-Type: application/json

Body (JSON) - English:
{
    "message": "Hello! Can you help me learn JavaScript?",
    "language": "en",
    "model_name": "langgraph-agent"
}

Body (JSON) - Arabic:
{
    "message": "السلام عليكم، أريد تعلم البرمجة",
    "language": "ar", 
    "model_name": "langgraph-agent"
}

Expected Response:
{
    "success": true,
    "data": {
        "id": 1,
        "conversationId": "550e8400-e29b-41d4-a716-446655440000",
        "message": "Hello! Can you help me learn JavaScript?",
        "response": "Hello! I'd be happy to help you learn JavaScript...",
        "model_name": "langgraph-agent",
        "language": "en",
        "createdAt": "2024-10-04T12:00:00Z",
        "agent_type": "langgraph"
    }
}
```

### **5. Send Simple Message (Direct LangChain)**
```
Method: POST
URL: {{baseUrl}}/api/chat/simple
Headers:
- Authorization: Bearer {{jwtToken}}
- Content-Type: application/json

Body (JSON):
{
    "message": "What is Node.js?",
    "model_name": "llama-3.1-8b",
    "language": "en"
}

Expected Response:
{
    "success": true,
    "data": {
        "id": 2,
        "conversationId": "default",
        "message": "What is Node.js?",
        "response": "Node.js is a JavaScript runtime built on Chrome's V8...",
        "model_name": "llama-3.1-8b", 
        "language": "en",
        "createdAt": "2024-10-04T12:05:00Z",
        "agent_type": "simple"
    }
}
```

### **6. Create New Conversation**
```
Method: POST
URL: {{baseUrl}}/api/chat/new-conversation
Headers:
- Authorization: Bearer {{jwtToken}}
- Content-Type: application/json

Body (JSON):
{
    "title": "Learning JavaScript Basics",
    "language": "en"
}

Expected Response:
{
    "success": true,
    "data": {
        "conversationId": "550e8400-e29b-41d4-a716-446655440000",
        "title": "Learning JavaScript Basics",
        "language": "en",
        "createdAt": "2024-10-04T12:00:00Z",
        "messageCount": 0
    }
}
```

### **7. Get All Conversations**
```
Method: GET
URL: {{baseUrl}}/api/chat/conversations?limit=20&offset=0
Headers:
- Authorization: Bearer {{jwtToken}}
- Content-Type: application/json

Expected Response:
{
    "success": true,
    "data": [
        {
            "conversationId": "550e8400-e29b-41d4-a716-446655440000",
            "title": "Conversation 10/4/2024",
            "messageCount": 5,
            "lastActivity": "2024-10-04T12:30:00Z",
            "createdAt": "2024-10-04T12:00:00Z",
            "language": "en"
        }
    ],
    "total": 3,
    "pagination": {
        "limit": 20,
        "offset": 0
    }
}
```

### **8. Get Conversation History**
```
Method: GET
URL: {{baseUrl}}/api/chat/history/550e8400-e29b-41d4-a716-446655440000?limit=50&offset=0&order=ASC
Headers:
- Authorization: Bearer {{jwtToken}}
- Content-Type: application/json

Expected Response:
{
    "success": true,
    "data": {
        "conversationId": "550e8400-e29b-41d4-a716-446655440000",
        "messages": [
            {
                "id": 1,
                "model_name": "langgraph-agent",
                "message": "Hello!",
                "response": "Hi! How can I help you today?",
                "language": "en",
                "createdAt": "2024-10-04T12:00:00Z",
                "conversationId": "550e8400-e29b-41d4-a716-446655440000"
            }
        ],
        "total": 5,
        "pagination": {
            "limit": 50,
            "offset": 0,
            "order": "ASC"
        }
    }
}
```

### **9. Get All Chat History (All Conversations)**
```
Method: GET
URL: {{baseUrl}}/api/chat/all-history?limit=100&offset=0&order=DESC
Headers:
- Authorization: Bearer {{jwtToken}}
- Content-Type: application/json

Expected Response:
{
    "success": true,
    "data": {
        "messages": [
            {
                "id": 10,
                "model_name": "langgraph-agent",
                "message": "Latest message",
                "response": "Latest response",
                "language": "en",
                "createdAt": "2024-10-04T15:30:00Z",
                "conversationId": "uuid-here"
            }
        ],
        "total": 25,
        "pagination": {
            "limit": 100,
            "offset": 0,
            "order": "DESC"
        }
    }
}
```

### **10. Get User Summary**
```
Method: GET
URL: {{baseUrl}}/api/chat/summary?language=en
Headers:
- Authorization: Bearer {{jwtToken}}
- Content-Type: application/json

Expected Response:
{
    "success": true,
    "data": {
        "summary": {
            "text": "This user is interested in learning JavaScript and web development...",
            "language": "en",
            "updatedAt": "2024-10-04T14:00:00Z"
        },
        "statistics": {
            "totalMessages": 25,
            "totalConversations": 3,
            "arabicMessages": 5,
            "englishMessages": 20,
            "lastActivity": "2024-10-04T15:30:00Z"
        },
        "hasSummary": true
    }
}
```

### **11. Delete Conversation**
```
Method: DELETE
URL: {{baseUrl}}/api/chat/conversation/550e8400-e29b-41d4-a716-446655440000
Headers:
- Authorization: Bearer {{jwtToken}}
- Content-Type: application/json

Body (JSON):
{
    "language": "en"
}

Expected Response:
{
    "success": true,
    "message": "Conversation deleted successfully (5 messages)",
    "data": {
        "conversationId": "550e8400-e29b-41d4-a716-446655440000",
        "deletedMessageCount": 5
    }
}
```

### **12. Get Service Status (No Auth Required)**
```
Method: GET
URL: {{baseUrl}}/api/chat/status
Headers: Content-Type: application/json

Expected Response:
{
    "success": true,
    "data": {
        "apiKeys": {
            "openai": true,
            "groq": true,
            "hasAnyKey": true
        },
        "memoryStats": {
            "totalMemories": 2,
            "totalChains": 4
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

## 🧪 **TESTING WORKFLOW**

### **📋 Step-by-Step Testing Process:**

1. **🔐 Authentication Flow:**
   ```
   1. POST /signup (create account)
   2. POST /login (get JWT token) 
   3. GET /profile (verify token works)
   ```

2. **🤖 Basic Chat Testing:**
   ```
   4. GET /status (check service health)
   5. POST /simple (test basic LangChain)
   6. POST /message (test LangGraph agent)
   ```

3. **💬 Conversation Management:**
   ```
   7. POST /new-conversation (create conversation)
   8. POST /message (with conversationId)
   9. GET /conversations (list all conversations)
   10. GET /history/:id (get specific conversation)
   ```

4. **📊 Advanced Features:**
   ```
   11. POST /message (request summary to generate UserSummary)
   12. GET /summary (retrieve user summary)
   13. GET /all-history (get complete history)
   14. DELETE /conversation/:id (cleanup)
   ```

---

## 🎯 **POSTMAN COLLECTION JSON**

### **Import This Collection:**
```json
{
    "info": {
        "name": "AI Chatbot API",
        "description": "Complete API testing for AI Chatbot with LangChain & LangGraph"
    },
    "variable": [
        {
            "key": "baseUrl",
            "value": "http://localhost:3000"
        },
        {
            "key": "jwtToken", 
            "value": ""
        }
    ],
    "auth": {
        "type": "bearer",
        "bearer": [
            {
                "key": "token",
                "value": "{{jwtToken}}"
            }
        ]
    }
}
```

---

## 🚨 **TESTING TIPS**

### **🔧 Before Testing:**
- ✅ Start server: `node server.js`
- ✅ Verify database: `node testDatabase.js`  
- ✅ Check environment variables in `.env`
- ✅ Ensure API keys are valid

### **📝 Testing Notes:**
- **JWT Token**: Must be copied from login response to `{{jwtToken}}`
- **Conversation IDs**: Use actual UUIDs from responses
- **Arabic Testing**: Use Arabic messages to test cultural features
- **Error Testing**: Try invalid tokens, missing fields, wrong IDs

### **🎯 Success Indicators:**
- ✅ All requests return `"success": true`
- ✅ Arabic responses include cultural greetings
- ✅ LangGraph agent detects intent correctly
- ✅ Conversation memory works across messages
- ✅ User summary generates after summary request

Your API is production-ready for comprehensive testing! 🚀
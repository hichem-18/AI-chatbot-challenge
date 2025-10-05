# 🤖 AI Chatbot Assistant

A modern, full-stack AI chatbot application built with React, Node.js, and powered by LangChain & LangGraph for advanced conversational AI capabilities.

## 🌟 Features

- **Multi-Model Support**: GPT-3.5, GPT-4, Llama 3.1 (8B/70B), and LangGraph Agent
- **Intelligent Routing**: Smart model selection based on query complexity
- **Real-time Chat**: Responsive chat interface with typing indicators
- **Conversation Management**: Create, manage, and delete chat conversations
- **Authentication**: Secure user authentication with JWT
- **Multi-language Support**: English and Arabic with RTL support
- **Dark/Light Mode**: Theme switching with persistence
- **Responsive Design**: Mobile-first design that works on all devices
- **AI Agent Integration**: Advanced LangGraph agents for complex tasks

## 🧠 LangChain & LangGraph Integration

### LangChain Usage
This application leverages LangChain for:
- **Prompt Engineering**: Structured prompt templates for consistent AI responses
- **Memory Management**: Conversation history and context preservation
- **Model Abstraction**: Unified interface for different AI models
- **Output Parsing**: Structured response parsing and validation

### LangGraph Implementation
LangGraph powers our advanced AI agent capabilities:
- **Workflow Orchestration**: Complex multi-step AI workflows
- **Decision Trees**: Conditional logic for intelligent response routing
- **State Management**: Persistent state across conversation turns
- **Agent Coordination**: Multiple specialized agents working together
- **Tool Integration**: Dynamic tool selection and execution

### AI Agent Architecture
```
User Query → LangGraph Router → Specialized Agents
                ├── Simple Chat Agent (GPT-3.5/4)
                ├── Code Assistant Agent (Llama 70B)
                ├── Research Agent (Multi-model)
                └── Creative Agent (GPT-4 + Tools)
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Automatic Setup (Recommended)
```bash
# Clone the repository
git clone <your-repo-url>
cd ai-chatbot

# Make run script executable
chmod +x run.sh

# Run the setup and start script
./run.sh
```

The script will automatically:
1. ✅ Check Node.js installation
2. ✅ Install dependencies for both backend and frontend
3. ✅ Create .env files from examples
4. ✅ Sync database
5. ✅ Start backend server (port 5000)
6. ✅ Start frontend server (port 5173)

### Manual Setup

#### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your API keys
node syncDatabase.js
npm start
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env if needed
npm run dev
```

## 📁 Project Structure

```
ai-chatbot/
├── 📁 backend/
│   ├── 📁 configs/
│   │   └── database.js          # Database configuration
│   ├── 📁 controllers/
│   │   ├── authController.js    # Authentication logic
│   │   └── chatController.js    # Chat & AI logic
│   ├── 📁 middleware/
│   │   └── authMiddleware.js    # JWT middleware
│   ├── 📁 models/
│   │   ├── User.js             # User model
│   │   ├── ChatHistory.js      # Chat history model
│   │   └── UserSummary.js      # User summary model
│   ├── 📁 routes/
│   │   ├── authRoutes.js       # Auth endpoints
│   │   └── chatRoutes.js       # Chat endpoints
│   ├── server.js               # Main server file
│   ├── syncDatabase.js         # Database sync script
│   └── aiModels.js            # AI model configurations
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/      # React components
│   │   ├── 📁 pages/          # Page components
│   │   ├── 📁 context/        # React context
│   │   ├── 📁 utils/          # Utility functions
│   │   └── 📁 hooks/          # Custom hooks
│   ├── index.html
│   └── vite.config.js
├── run.sh                      # Setup & start script
└── README.md                   # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/refresh` - Refresh JWT token

### Chat
- `GET /api/chat/conversations` - Get user conversations
- `POST /api/chat/conversations` - Create new conversation
- `DELETE /api/chat/conversations/:id` - Delete conversation
- `GET /api/chat/conversations/:id/messages` - Get conversation messages
- `POST /api/chat/message` - Send message (LangGraph agent)
- `POST /api/chat/simple` - Send simple message (direct model)

### User
- `GET /api/user/summary` - Get user statistics
- `PUT /api/user/preferences` - Update user preferences

## 🛠️ Environment Variables

### Backend (.env)
```bash
# Required
DATABASE_URL=sqlite:./chatbot.db
JWT_SECRET=your-jwt-secret
OPENAI_API_KEY=your-openai-key
PORT=5000

# Optional
GROQ_API_KEY=your-groq-key
LANGCHAIN_API_KEY=your-langchain-key
NODE_ENV=development
CORS_ORIGINS=http://localhost:5173
```

### Frontend (.env)
```bash
# Required
VITE_API_URL=http://localhost:5000

# Optional
VITE_APP_TITLE=AI Chatbot
VITE_ENABLE_DARK_MODE=true
```

## 🎯 Model Configuration

### Supported Models
1. **LangGraph Agent** - Advanced multi-step reasoning
2. **GPT-3.5 Turbo** - Fast, efficient responses
3. **GPT-4** - High-quality, complex reasoning
4. **Llama 3.1 8B** - Open-source, privacy-focused
5. **Llama 3.1 70B** - Powerful open-source model

### Smart Routing Logic
The application intelligently routes queries:
- **Simple queries** → GPT-3.5 Turbo
- **Complex analysis** → GPT-4
- **Code-related** → Llama 70B
- **Multi-step tasks** → LangGraph Agent

## 🎨 Frontend Features

### Technologies Used
- **React 18** with Hooks
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Context API** for state management
- **React i18next** for internationalization

### Key Components
- `Chat.jsx` - Main chat interface
- `ConversationList.jsx` - Sidebar with conversations
- `Message.jsx` - Individual message component
- `Navigation.jsx` - App navigation
- `LanguageSwitcher.jsx` - Language toggle

## 🔐 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt for password security
- **Rate Limiting** - API rate limiting
- **CORS Protection** - Cross-origin request security
- **Input Validation** - Sanitized user inputs
- **SQL Injection Protection** - Sequelize ORM protection

## 📱 Responsive Design

- **Mobile First** - Optimized for mobile devices
- **Hamburger Menu** - Collapsible sidebar on mobile
- **Touch Friendly** - Large touch targets
- **Adaptive Layout** - Flexible grid system
- **Dark Mode** - Theme persistence

## 🌐 Internationalization

- **Multi-language Support** - English and Arabic
- **RTL Support** - Right-to-left text direction
- **Dynamic Loading** - Language switching without reload
- **Locale-aware** - Date, time, and number formatting

## 🐛 Troubleshooting

### Common Issues

#### Backend won't start
```bash
# Check if port 5000 is in use
lsof -i :5000
# Kill the process if needed
kill -9 <PID>
```

#### Database errors
```bash
# Reset database
cd backend
rm chatbot.db
node syncDatabase.js
```

#### Frontend build issues
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### API connection errors
- Check `.env` files for correct URLs
- Ensure backend is running on port 5000
- Check CORS configuration

#### Missing API keys
1. Get OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Get Groq API key from [Groq Console](https://console.groq.com/keys)
3. Add keys to `backend/.env`

### Debug Mode
Enable debug logging:
```bash
# Backend
LOG_LEVEL=debug npm start

# Frontend
VITE_DEBUG=true npm run dev
```

### Performance Issues
- **Slow responses**: Check API key limits
- **Memory usage**: Restart servers periodically
- **Database locks**: Check for long-running queries

## 📊 Performance Optimization

### Backend Optimizations
- **Database Indexing** - Optimized queries
- **Connection Pooling** - Efficient DB connections
- **Caching** - Response caching for static data
- **Compression** - Gzip compression for responses

### Frontend Optimizations
- **Code Splitting** - Lazy loading components
- **Image Optimization** - Compressed assets
- **Bundle Analysis** - Minimal bundle size
- **Memoization** - React.memo for expensive components

## 🚢 Deployment

### Production Build
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run start:prod
```

### Environment Variables for Production
- Change `JWT_SECRET` to a strong, unique value
- Set `NODE_ENV=production`
- Use production database URL
- Configure proper CORS origins

### Docker Support (Optional)
```dockerfile
# Dockerfile example for backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Issues**: Create a GitHub issue
- **Documentation**: Check this README
- **API Docs**: Visit `/api` endpoint when server is running

## 🔄 Updates & Changelog

### Version 1.0.0
- ✅ Initial release
- ✅ Multi-model AI support
- ✅ LangGraph integration
- ✅ Responsive design
- ✅ Authentication system
- ✅ Conversation management

---

**Happy Chatting! 🎉**
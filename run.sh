#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to kill process on port
kill_port() {
    local port=$1
    if command_exists lsof; then
        local pid=$(lsof -ti:$port)
        if [ ! -z "$pid" ]; then
            print_warning "Killing existing process on port $port (PID: $pid)"
            kill -9 $pid 2>/dev/null || true
        fi
    fi
}

print_status "🚀 Starting AI Chatbot Application Setup..."

# 1. Check for Node.js installation
print_status "Checking Node.js installation..."
if ! command_exists node; then
    print_error "Node.js is not installed. Please install Node.js (v16 or higher) from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version)
print_success "Node.js found: $NODE_VERSION"

# Check npm
if ! command_exists npm; then
    print_error "npm is not found. Please install npm."
    exit 1
fi

NPM_VERSION=$(npm --version)
print_success "npm found: $NPM_VERSION"

# 2. Install backend dependencies
print_status "Installing backend dependencies..."
if [ ! -d "backend" ]; then
    print_error "Backend directory not found!"
    exit 1
fi

cd backend
if [ ! -f "package.json" ]; then
    print_error "Backend package.json not found!"
    exit 1
fi

npm install
if [ $? -ne 0 ]; then
    print_error "Failed to install backend dependencies"
    exit 1
fi
print_success "Backend dependencies installed successfully"
cd ..

# 3. Install frontend dependencies
print_status "Installing frontend dependencies..."
if [ ! -d "frontend" ]; then
    print_error "Frontend directory not found!"
    exit 1
fi

cd frontend
if [ ! -f "package.json" ]; then
    print_error "Frontend package.json not found!"
    exit 1
fi

npm install
if [ $? -ne 0 ]; then
    print_error "Failed to install frontend dependencies"
    exit 1
fi
print_success "Frontend dependencies installed successfully"
cd ..

# 4. Create .env files from .env.example if missing
print_status "Setting up environment files..."

# Backend .env
if [ ! -f "backend/.env" ]; then
    if [ -f "backend/.env.example" ]; then
        cp backend/.env.example backend/.env
        print_success "Created backend/.env from .env.example"
        print_warning "Please update backend/.env with your actual values (API keys, database URL, etc.)"
    else
        print_warning "backend/.env.example not found. Creating basic .env file..."
        cat > backend/.env << EOF
DATABASE_URL=sqlite:./chatbot.db
JWT_SECRET=your-jwt-secret-change-this-in-production
OPENAI_API_KEY=your-openai-api-key
GROQ_API_KEY=your-groq-api-key
PORT=5000
NODE_ENV=development
EOF
        print_success "Created basic backend/.env file"
    fi
else
    print_success "Backend .env file already exists"
fi

# Frontend .env
if [ ! -f "frontend/.env" ]; then
    if [ -f "frontend/.env.example" ]; then
        cp frontend/.env.example frontend/.env
        print_success "Created frontend/.env from .env.example"
    else
        print_warning "frontend/.env.example not found. Creating basic .env file..."
        cat > frontend/.env << EOF
VITE_API_URL=http://localhost:5000
EOF
        print_success "Created basic frontend/.env file"
    fi
else
    print_success "Frontend .env file already exists"
fi

# 5. Run database sync
print_status "Running database synchronization..."
cd backend
if [ -f "syncDatabase.js" ]; then
    node syncDatabase.js
    if [ $? -eq 0 ]; then
        print_success "Database synchronized successfully"
    else
        print_warning "Database sync encountered issues, but continuing..."
    fi
else
    print_warning "syncDatabase.js not found, skipping database sync"
fi
cd ..

# 6. Kill existing processes on ports
kill_port 5000
kill_port 5173

# Start backend on port 5000 (background process)
print_status "Starting backend server on port 5000..."
cd backend
npm start > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
print_status "Waiting for backend to initialize..."
sleep 3

# Check if backend is running
if kill -0 $BACKEND_PID 2>/dev/null; then
    print_success "Backend server started successfully (PID: $BACKEND_PID)"
else
    print_error "Failed to start backend server. Check backend.log for details."
    exit 1
fi

# 7. Start frontend on port 5173
print_status "Starting frontend development server on port 5173..."
cd frontend

# Function to handle cleanup
cleanup() {
    print_warning "Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null || true
    kill_port 5000
    kill_port 5173
    print_success "Cleanup completed"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start frontend (this will block)
print_success "🎉 Starting frontend server..."
print_status "=========================================="
print_success "🌐 Frontend: http://localhost:5173"
print_success "🔧 Backend:  http://localhost:5000"
print_success "📊 API Docs: http://localhost:5000/api"
print_status "=========================================="
print_warning "Press Ctrl+C to stop both servers"
print_status "Backend logs are available in backend.log"

npm run dev

# If we reach here, frontend stopped
cleanup
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management utilities
export const tokenManager = {
  /**
   * Get JWT token from localStorage
   */
  getToken: () => {
    return localStorage.getItem('jwtToken');
  },

  /**
   * Set JWT token in localStorage
   */
  setToken: (token) => {
    if (token) {
      localStorage.setItem('jwtToken', token);
    } else {
      localStorage.removeItem('jwtToken');
    }
  },

  /**
   * Remove JWT token from localStorage
   */
  removeToken: () => {
    localStorage.removeItem('jwtToken');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    const token = tokenManager.getToken();
    if (!token) return false;
    
    try {
      // Decode JWT token to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      // Check if token is expired
      if (payload.exp && payload.exp < currentTime) {
        tokenManager.removeToken();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Invalid token format:', error);
      tokenManager.removeToken();
      return false;
    }
  },

  /**
   * Get user information from JWT token
   */
  getUserInfo: () => {
    const token = tokenManager.getToken();
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.id,
        email: payload.email,
        username: payload.username,
        exp: payload.exp,
        iat: payload.iat
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
};

// Request interceptor - Add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    
    if (token && tokenManager.isAuthenticated()) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add language header for backend
    const language = localStorage.getItem('i18nextLng') || 'en';
    config.headers['Accept-Language'] = language;
    
    // Log request in development
    
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses and errors
api.interceptors.response.use(
  (response) => {
  
    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      // Handle authentication errors
      if (status === 401) {
        console.warn('Authentication failed, removing token');
        tokenManager.removeToken();
        
        // Redirect to login if not already there
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      
      // Handle authorization errors
      if (status === 403) {
        console.warn('Access forbidden');
      }
      
      // Log error in development
      if (import.meta.env.DEV) {
        console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
          status,
          data,
          message: data?.message || error.message
        });
      }
      
      // Return formatted error
      return Promise.reject({
        status,
        message: data?.message || getErrorMessage(status),
        data: data
      });
      
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.request);
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your internet connection.',
        data: null
      });
      
    } else {
      // Other errors
      console.error('API error:', error.message);
      return Promise.reject({
        status: -1,
        message: error.message || 'An unexpected error occurred',
        data: null
      });
    }
  }
);

/**
 * Get user-friendly error message based on status code
 */
const getErrorMessage = (status) => {
  const errorMessages = {
    400: 'Invalid request. Please check your input.',
    401: 'Authentication required. Please log in.',
    403: 'Access denied. You do not have permission.',
    404: 'Resource not found.',
    408: 'Request timeout. Please try again.',
    409: 'Conflict. Resource already exists.',
    422: 'Validation error. Please check your input.',
    429: 'Too many requests. Please slow down.',
    500: 'Server error. Please try again later.',
    502: 'Bad gateway. Service temporarily unavailable.',
    503: 'Service unavailable. Please try again later.',
    504: 'Gateway timeout. Please try again later.'
  };
  
  return errorMessages[status] || `HTTP Error ${status}`;
};

// API endpoints
export const authAPI = {
  /**
   * User login
   */
  login: (credentials) => api.post('/auth/login', credentials),
  
  /**
   * User registration
   */
  signup: (userData) => api.post('/auth/signup', userData),
  
  /**
   * Get user profile
   */
  getProfile: () => api.get('/auth/me'),
  
  /**
   * Update user profile
   */
  updateProfile: (userData) => api.put('/auth/me', userData),
  
  /**
   * Logout (client-side token removal)
   */
  logout: () => {
    tokenManager.removeToken();
    return Promise.resolve();
  }
};

export const chatAPI = {
  /**
   * Send message - routes to correct endpoint based on model
   */
  sendMessage: (messageData) => {
    // Route langgraph-agent to main endpoint, others to simple endpoint
    const endpoint = messageData.model_name === 'langgraph-agent' 
      ? '/chat/message' 
      : '/chat/simple';
    return api.post(endpoint, messageData);
  },
  
  /**
   * Send simple message using LangChain
   */
  sendSimpleMessage: (messageData) => api.post('/chat/simple', messageData),
  
  /**
   * Create new conversation
   */
  createConversation: (conversationData) => api.post('/chat/new-conversation', conversationData),
  
  /**
   * Get all user conversations
   */
  getConversations: (params = {}) => api.get('/chat/conversations', { params }),
  
  /**
   * Get conversation history
   */
  getConversationHistory: (conversationId, params = {}) => 
    api.get(`/chat/history/${conversationId}`, { params }),
  
  /**
   * Get all chat history
   */
  getAllHistory: (params = {}) => api.get('/chat/all-history', { params }),
  
  /**
   * Get user summary
   */
  getUserSummary: (params = {}) => api.get('/chat/summary', { params }),
  
  /**
   * Delete conversation
   */
  deleteConversation: (conversationId, data = {}) => 
    api.delete(`/chat/conversation/${conversationId}`, { data }),
  
  /**
   * Get service status
   */
  getStatus: () => api.get('/chat/status')
};

// Helper functions for common API operations
export const apiHelpers = {
  /**
   * Handle API response and extract data
   */
  handleResponse: (response) => {
    return response.data?.data || response.data;
  },
  
  /**
   * Handle API error and extract message
   */
  handleError: (error) => {
    return {
      message: error.message || 'An error occurred',
      status: error.status || 0,
      data: error.data || null
    };
  },
  
  /**
   * Create request with loading and error handling
   */
  createRequest: async (apiCall, options = {}) => {
    const { onLoading, onSuccess, onError, showNotification } = options;
    
    try {
      if (onLoading) onLoading(true);
      
      const response = await apiCall();
      const data = apiHelpers.handleResponse(response);
      
      if (onSuccess) onSuccess(data);
      
      return data;
      
    } catch (error) {
      const errorInfo = apiHelpers.handleError(error);
      
      if (onError) onError(errorInfo);
      if (showNotification?.error) {
        console.error('Error:', errorInfo.message);
      }
      
      throw errorInfo;
      
    } finally {
      if (onLoading) onLoading(false);
    }
  }
};

// Export the configured axios instance
export default api;
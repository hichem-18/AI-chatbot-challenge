// test-chat-endpoints.js
// Test script for all chat endpoints with LangChain integration

import { User } from './models/index.js';
import { testConnection } from './configs/database.js';

const API_BASE = 'http://localhost:8000/api';

// Helper function to make authenticated requests
const makeRequest = async (endpoint, method = 'GET', data = null, token = null) => {
  const url = `${API_BASE}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    ...(data && { body: JSON.stringify(data) })
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return { status: response.status, data: result };
  } catch (error) {
    return { status: 500, error: error.message };
  }
};

const testChatEndpoints = async () => {

  try {
    // Test database connection
    await testConnection();

    // Create test user and get token (you'll need to implement this)
    const testUser = await User.findOrCreate({
      where: { email: 'chat-test@example.com' },
      defaults: {
        email: 'chat-test@example.com',
        password: 'testpassword123',
        language_preference: 'en'
      }
    });


  } catch (error) {
    console.error('❌ Chat endpoints test failed:', error.message);
    console.error('Full error:', error);
  }
};

// Run the tests
testChatEndpoints();
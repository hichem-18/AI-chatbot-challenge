// testAuth.js
// Simple test script for authentication endpoints
// Run with: node testAuth.js

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:8000/api/auth';

// Test user data
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  language_preference: 'en'
};

// Test functions
const testSignup = async () => {
  try {
    const response = await fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    
    const data = await response.json();
    
    if (data.success && data.token) {
      return data.token;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Signup error:', error.message);
    return null;
  }
};

const testLogin = async () => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });
    
    const data = await response.json();
    
    if (data.success && data.token) {
      return data.token;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Login error:', error.message);
    return null;
  }
};

const testMe = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/me`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.success && data.user) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

const testLogout = async () => {
  try {
    const response = await fetch(`${BASE_URL}/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    const data = await response.json();
    
    if (data.success) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Logout error:', error.message);
    return false;
  }
};

// Run all tests
const runTests = async () => {
  
  // Test signup (might fail if user already exists)
  let token = await testSignup();
  
  // If signup failed, try login
  if (!token) {
    token = await testLogin();
  }
  
  if (token) {
    // Test protected endpoint
    await testMe(token);
    
    // Test logout
    await testLogout();
  } else {
  }
  
};

// Check if server is running
const checkServer = async () => {
  try {
    const response = await fetch('http://localhost:8000/');
    if (response.ok) {
      return true;
    }
  } catch (error) {
    return false;
  }
};

// Main execution
const main = async () => {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await runTests();
  }
};

main().catch(console.error);
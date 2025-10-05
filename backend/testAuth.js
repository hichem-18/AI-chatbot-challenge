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
    console.log('🔸 Testing signup...');
    const response = await fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    
    const data = await response.json();
    console.log('Signup response:', data);
    
    if (data.success && data.token) {
      console.log('✅ Signup successful');
      return data.token;
    } else {
      console.log('❌ Signup failed');
      return null;
    }
  } catch (error) {
    console.error('Signup error:', error.message);
    return null;
  }
};

const testLogin = async () => {
  try {
    console.log('\n🔸 Testing login...');
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });
    
    const data = await response.json();
    console.log('Login response:', data);
    
    if (data.success && data.token) {
      console.log('✅ Login successful');
      return data.token;
    } else {
      console.log('❌ Login failed');
      return null;
    }
  } catch (error) {
    console.error('Login error:', error.message);
    return null;
  }
};

const testMe = async (token) => {
  try {
    console.log('\n🔸 Testing /me endpoint...');
    const response = await fetch(`${BASE_URL}/me`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('Me response:', data);
    
    if (data.success && data.user) {
      console.log('✅ Me endpoint successful');
      return true;
    } else {
      console.log('❌ Me endpoint failed');
      return false;
    }
  } catch (error) {
    console.error('Me endpoint error:', error.message);
    return false;
  }
};

const testLogout = async () => {
  try {
    console.log('\n🔸 Testing logout...');
    const response = await fetch(`${BASE_URL}/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    const data = await response.json();
    console.log('Logout response:', data);
    
    if (data.success) {
      console.log('✅ Logout successful');
      return true;
    } else {
      console.log('❌ Logout failed');
      return false;
    }
  } catch (error) {
    console.error('Logout error:', error.message);
    return false;
  }
};

// Run all tests
const runTests = async () => {
  console.log('🧪 Authentication System Test');
  console.log('============================');
  
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
    console.log('❌ Could not get token, skipping protected tests');
  }
  
  console.log('\n✨ Test completed');
};

// Check if server is running
const checkServer = async () => {
  try {
    const response = await fetch('http://localhost:8000/');
    if (response.ok) {
      console.log('🚀 Server is running');
      return true;
    }
  } catch (error) {
    console.log('❌ Server is not running. Please start server with: node server.js');
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
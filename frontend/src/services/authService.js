// Authentication service layer
// Uses the configured axios instance from utils/api.js

import { authAPI, tokenManager } from '../utils/api.js';

/**
 * Register a new user
 * @param {Object} userData - { email, password, language_preference }
 * @returns {Promise<Object>} - { success, data?, error? }
 */
export const registerUser = async (userData) => {
  try {
    
    const response = await authAPI.signup(userData);
    
    // Extract token and user from response
    const { token, user } = response.data;
    
    if (token) {
      // Save token to localStorage
      tokenManager.setToken(token);
    }
    
    return {
      success: true,
      data: { token, user }
    };
    
  } catch (error) {
    console.error('❌ AuthService: Registration failed', error);
    
    const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Login user
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} - { success, data?, error? }
 */
export const loginUser = async (credentials) => {
  try {
    
    const response = await authAPI.login(credentials);
    
    // Extract token and user from response
    const { token, user } = response.data;
    
    if (token) {
      // Save token to localStorage
      tokenManager.setToken(token);
    }
    
    return {
      success: true,
      data: { token, user }
    };
    
  } catch (error) {
    console.error('❌ AuthService: Login failed', error);
    
    const errorMessage = error.response?.data?.message || error.message || 'Login failed';
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Get current authenticated user
 * @returns {Promise<Object>} - { success, data?, error? }
 */
export const getCurrentUser = async () => {
  try {
    
    // Check if token exists and is valid
    if (!tokenManager.isAuthenticated()) {
      return {
        success: false,
        error: 'No valid token found'
      };
    }
    
    const response = await authAPI.getProfile();
    
    return {
      success: true,
      data: { user: response.data.user }
    };
    
  } catch (error) {
    console.error('❌ AuthService: Failed to get current user', error);
    
    // If 401, token is invalid - remove it
    if (error.response?.status === 401) {
      tokenManager.removeToken();
    }
    
    const errorMessage = error.response?.data?.message || error.message || 'Failed to get user';
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Logout user
 * @returns {Promise<Object>} - { success }
 */
export const logoutUser = async () => {
  try {
    
    // Remove token from localStorage
    await authAPI.logout();
    
    
    return {
      success: true
    };
    
  } catch (error) {
    console.error('❌ AuthService: Logout error', error);
    
    // Even if API call fails, remove token locally
    tokenManager.removeToken();
    
    return {
      success: true // Always succeed for logout
    };
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return tokenManager.isAuthenticated();
};

/**
 * Get user info from stored token
 * @returns {Object|null}
 */
export const getUserInfo = () => {
  return tokenManager.getUserInfo();
};

/**
 * Update user profile
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} - { success, data?, error? }
 */
export const updateUserProfile = async (userData) => {
  try {
    
    const response = await authAPI.updateProfile(userData);
    
    return {
      success: true,
      data: { user: response.data.user }
    };
    
  } catch (error) {
    console.error('❌ AuthService: Profile update failed', error);
    
    const errorMessage = error.response?.data?.message || error.message || 'Profile update failed';
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

// Export token manager for direct access if needed
export { tokenManager };

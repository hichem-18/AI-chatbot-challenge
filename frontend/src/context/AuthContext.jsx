import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, tokenManager } from '../utils/api';
import { dummyUsers } from '../assets/assets';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // For frontend testing, auto-login with dummy user
        // Comment this out when connecting to real backend
        console.log('🎭 Frontend Testing Mode: Auto-logging in with dummy user');
        setUser(dummyUsers);
        setIsAuthenticated(true);
        setLoading(false);
        return;
        
        // Real authentication logic (disabled for frontend testing)
        const token = tokenManager.getToken();
        if (token && tokenManager.isAuthenticated()) {
          const userInfo = tokenManager.getUserInfo();
          setUser(userInfo);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid token
        tokenManager.removeToken();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authAPI.login(credentials);
      
      if (response.data?.success) {
        const { token, user: userData } = response.data.data;
        
        // Store token
        tokenManager.setToken(token);
        
        // Update state
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true, user: userData };
      } else {
        throw new Error(response.data?.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      const response = await authAPI.signup(userData);
      
      if (response.data?.success) {
        const { token, user: newUser } = response.data.data;
        
        // Store token
        tokenManager.setToken(token);
        
        // Update state
        setUser(newUser);
        setIsAuthenticated(true);
        
        return { success: true, user: newUser };
      } else {
        throw new Error(response.data?.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // Call logout API if available
      try {
        await authAPI.logout();
      } catch (error) {
        // Continue with logout even if API call fails
        console.warn('Logout API call failed:', error);
      }
      
      // Clear token and state
      tokenManager.removeToken();
      setUser(null);
      setIsAuthenticated(false);
      
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
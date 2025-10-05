import React, { createContext, useContext, useState, useEffect } from 'react';
import { registerUser, loginUser, getCurrentUser, logoutUser, tokenManager } from '../services/authService';

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
  const [token, setToken] = useState(tokenManager.getToken());
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user on mount if token exists
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = tokenManager.getToken();
        if (token) {
          console.log('🔑 Token found, verifying with backend...');
          const result = await getCurrentUser();
          
          if (result.success) {
            setUser(result.data.user);
            setIsAuthenticated(true);
            console.log('✅ User authenticated:', result.data.user.email);
          } else {
            console.log('❌ Token invalid, removing...');
            tokenManager.removeToken();
          }
        } else {
          console.log('🔓 No token found, user not authenticated');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
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
      console.log('🔄 Logging in user:', credentials.email);
      
      const result = await loginUser(credentials);
      
      if (result.success) {
        setUser(result.data.user);
        setToken(result.data.token);
        setIsAuthenticated(true);
        console.log('✅ Login successful:', result.data.user.email);
        return { success: true, user: result.data.user };
      } else {
        console.log('❌ Login failed:', result.error);
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      console.log('🔄 Registering user:', userData.email);
      
      const result = await registerUser(userData);
      
      if (result.success) {
        setUser(result.data.user);
        setToken(result.data.token);
        setIsAuthenticated(true);
        console.log('✅ Registration successful:', result.data.user.email);
        return { success: true, user: result.data.user };
      } else {
        console.log('❌ Registration failed:', result.error);
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      console.log('🔄 Logging out user');
      
      const result = await logoutUser();
      
      // Clear state regardless of API response
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      
      console.log('✅ User logged out');
      
      // Redirect to login page
      window.location.href = '/login';
      
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear state even if logout API fails
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const loadUser = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading current user...');
      
      const result = await getCurrentUser();
      
      if (result.success) {
        setUser(result.data.user);
        setIsAuthenticated(true);
        console.log('✅ User loaded:', result.data.user.email);
        return { success: true, user: result.data.user };
      } else {
        console.log('❌ Failed to load user:', result.error);
        tokenManager.removeToken();
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Load user error:', error);
      tokenManager.removeToken();
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
    loadUser,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService } from '../api/apiService';
import { apiClient } from '../api/client';
import { setAppCurrency } from '../utils/formatters';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(apiClient.getToken());
  const [loading, setLoading] = useState(true);
  const [apiUrl, setApiUrlState] = useState(apiClient.getBaseUrl());

  const initAuth = useCallback(async () => {
    try {
      setLoading(true);
      const currentUser = apiClient.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setToken(apiClient.getToken());
        setAppCurrency(currentUser.currency || 'USD');
      } else {
        setUser(null);
        setToken('');
      }
    } catch (e) {
      console.warn('Init auth error:', e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();

    const handleUnauthorized = () => {
      setUser(null);
      setToken('');
      apiClient.setCurrentUser(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [initAuth]);

  const login = async (email, password, username, expectedRole) => {
    const res = await apiService.auth.login(email, password, username, expectedRole);
    setUser(res.user);
    setToken(res.token);
    if (res.user?.currency) {
      setAppCurrency(res.user.currency);
    }
    return res.user;
  };

  const register = async (userData) => {
    const res = await apiService.auth.register(userData);
    setUser(res.user);
    setToken(res.token);
    if (res.user?.currency) {
      setAppCurrency(res.user.currency);
    }
    return res.user;
  };

  const logout = () => {
    apiService.auth.logout();
    setUser(null);
    setToken('');
  };

  const updateProfile = async (data) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    apiClient.setCurrentUser(updated);
    if (data.currency) {
      setAppCurrency(data.currency);
    }
    try {
      await apiService.auth.updateProfile(data);
    } catch (e) {
      console.warn('Profile sync error:', e);
    }
    return updated;
  };

  const setApiUrl = (url) => {
    setApiUrlState(url);
    apiClient.setBaseUrl(url);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ROLE_ADMIN',
        login,
        register,
        logout,
        updateProfile,
        apiUrl,
        setApiUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register, logout, getCurrentUser } from '../services/authService';
import { toast } from 'react-toastify';
import jwtDecode from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  };

  // Load user data on startup
  useEffect(() => {
    const loadUser = async () => {
      try {
        if (token && !isTokenExpired(token)) {
          const userData = await getCurrentUser(token);
          setCurrentUser(userData);
        } else {
          localStorage.removeItem('token');
          setToken(null);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        localStorage.removeItem('token');
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Login user
  const loginUser = async (credentials) => {
    try {
      const data = await login(credentials);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setCurrentUser(data.user);
      toast.success('Login successful!');
      navigate('/dashboard');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  // Register user
  const registerUser = async (userData) => {
    try {
      const data = await register(userData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  // Logout user
  const logoutUser = () => {
    logout();
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
    toast.info('You have been logged out');
    navigate('/');
  };

  // Check if user is admin
  const isAdmin = () => {
    return currentUser?.role === 'admin';
  };

  const value = {
    currentUser,
    token,
    loading,
    loginUser,
    registerUser,
    logoutUser,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

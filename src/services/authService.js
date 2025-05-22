import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Configure axios with token
const authAxios = (token) => {
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
};

// Login user
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Register user
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get current user
export const getCurrentUser = async (token) => {
  try {
    const response = await authAxios(token).get(`${API_URL}/auth/me`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update user profile
export const updateProfile = async (token, userData) => {
  try {
    const response = await authAxios(token).put(`${API_URL}/users/profile`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Change password
export const changePassword = async (token, passwordData) => {
  try {
    const response = await authAxios(token).put(`${API_URL}/auth/change-password`, passwordData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Request password reset
export const requestPasswordReset = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Reset password
export const resetPassword = async (resetToken, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/auth/reset-password`, { 
      resetToken, 
      newPassword 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Verify email
export const verifyEmail = async (verificationToken) => {
  try {
    const response = await axios.post(`${API_URL}/auth/verify-email`, { verificationToken });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Logout (clear any server-side session if applicable)
export const logout = () => {
  // This function might be useful if we need to invalidate the token on the server
  // For now, token removal is handled in the AuthContext
};

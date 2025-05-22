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

// Get user transactions
export const getUserTransactions = async (token, page = 1, limit = 20) => {
  try {
    const response = await authAxios(token).get(`${API_URL}/transactions?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get transaction by ID
export const getTransactionById = async (token, transactionId) => {
  try {
    const response = await authAxios(token).get(`${API_URL}/transactions/${transactionId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a buy order
export const createBuyOrder = async (token, orderData) => {
  try {
    const response = await authAxios(token).post(`${API_URL}/transactions/buy`, orderData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a sell order
export const createSellOrder = async (token, orderData) => {
  try {
    const response = await authAxios(token).post(`${API_URL}/transactions/sell`, orderData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get user's open orders
export const getOpenOrders = async (token) => {
  try {
    const response = await authAxios(token).get(`${API_URL}/transactions/orders/open`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Cancel order
export const cancelOrder = async (token, orderId) => {
  try {
    const response = await authAxios(token).delete(`${API_URL}/transactions/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get transaction statistics
export const getTransactionStats = async (token) => {
  try {
    const response = await authAxios(token).get(`${API_URL}/transactions/stats`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Deposit funds
export const depositFunds = async (token, depositData) => {
  try {
    const response = await authAxios(token).post(`${API_URL}/wallet/deposit`, depositData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Withdraw funds
export const withdrawFunds = async (token, withdrawData) => {
  try {
    const response = await authAxios(token).post(`${API_URL}/wallet/withdraw`, withdrawData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get wallet balance
export const getWalletBalance = async (token) => {
  try {
    const response = await authAxios(token).get(`${API_URL}/wallet/balance`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get wallet history
export const getWalletHistory = async (token, page = 1, limit = 20) => {
  try {
    const response = await authAxios(token).get(`${API_URL}/wallet/history?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

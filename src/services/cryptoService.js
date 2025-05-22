import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
const API_KEY = process.env.REACT_APP_CRYPTO_API_KEY;

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

// Get all cryptocurrencies with market data
export const getAllCryptos = async (page = 1, limit = 20) => {
  try {
    const response = await axios.get(`${API_URL}/crypto?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get cryptocurrency details by ID
export const getCryptoById = async (cryptoId) => {
  try {
    const response = await axios.get(`${API_URL}/crypto/${cryptoId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get cryptocurrency price history for chart
export const getCryptoPriceHistory = async (cryptoId, timeframe = '7d') => {
  try {
    const response = await axios.get(`${API_URL}/crypto/${cryptoId}/history?timeframe=${timeframe}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Buy cryptocurrency
export const buyCrypto = async (token, data) => {
  try {
    const response = await authAxios(token).post(`${API_URL}/transactions/buy`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Sell cryptocurrency
export const sellCrypto = async (token, data) => {
  try {
    const response = await authAxios(token).post(`${API_URL}/transactions/sell`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get user cryptocurrency portfolio
export const getUserPortfolio = async (token) => {
  try {
    const response = await authAxios(token).get(`${API_URL}/users/portfolio`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get market trending cryptocurrencies
export const getTrendingCryptos = async () => {
  try {
    const response = await axios.get(`${API_URL}/crypto/trending`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Search cryptocurrencies
export const searchCryptos = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/crypto/search?q=${query}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get market statistics
export const getMarketStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/crypto/market-stats`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get cryptocurrency news
export const getCryptoNews = async (limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}/crypto/news?limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Format currency values
export const formatCurrency = (amount, currency = 'USD', decimals = 2) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
};

// Format percentage values
export const formatPercentage = (value, decimals = 2) => {
  return `${(value >= 0 ? '+' : '')}${value.toFixed(decimals)}%`;
};

// Format crypto amounts
export const formatCryptoAmount = (amount, symbol, decimals = 8) => {
  return `${amount.toFixed(decimals)} ${symbol}`;
};

// Format large numbers with abbreviations
export const formatLargeNumber = (num) => {
  if (num >= 1e12) {
    return (num / 1e12).toFixed(1) + 'T';
  }
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + 'B';
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + 'M';
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + 'K';
  }
  return num.toString();
};

// Format dates
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  
  return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};

// Truncate long strings
export const truncateString = (str, maxLength = 20) => {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};

// Format transaction status
export const formatTransactionStatus = (status) => {
  const statusMap = {
    pending: 'Pending',
    completed: 'Completed',
    failed: 'Failed',
    cancelled: 'Cancelled',
  };
  return statusMap[status] || status;
};

// Format transaction type
export const formatTransactionType = (type) => {
  const typeMap = {
    buy: 'Buy',
    sell: 'Sell',
    deposit: 'Deposit',
    withdrawal: 'Withdrawal',
  };
  return typeMap[type] || type;
};

// Get color class based on price change
export const getPriceChangeColor = (change) => {
  if (change > 0) return 'text-green-600';
  if (change < 0) return 'text-red-600';
  return 'text-gray-600';
};

// Format crypto symbol for display
export const formatCryptoSymbol = (symbol) => {
  return symbol.toUpperCase();
};

// Format price with dynamic decimal places
export const formatPrice = (price) => {
  if (price >= 1) {
    return price.toFixed(2);
  } else if (price >= 0.01) {
    return price.toFixed(4);
  } else {
    return price.toFixed(8);
  }
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePassword = (password) => {
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
    minLength,
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSpecialChar,
  };
};

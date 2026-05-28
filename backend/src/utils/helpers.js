// Utility functions for the backend

export const generateOrderId = () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `XC-${dateStr}-${random}`;
};

export const generateTicketId = (count) => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  return `TKT-${dateStr}-${String(count).padStart(4, '0')}`;
};

export const calculateDiscountAmount = (orderAmount, discount) => {
  if (discount.discountType === 'percentage') {
    const amount = (orderAmount * discount.discountValue) / 100;
    return discount.maxDiscountAmount 
      ? Math.min(amount, discount.maxDiscountAmount) 
      : amount;
  }
  return discount.discountValue;
};

export const calculateTax = (amount, taxRate = 18) => {
  return (amount * taxRate) / 100;
};

export const formatCurrency = (amount, currency = 'INR') => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency
  });
  return formatter.format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-IN');
};

export const calculateEstimatedDelivery = (estimatedMinutes = 120) => {
  const delivery = new Date();
  delivery.setMinutes(delivery.getMinutes() + estimatedMinutes);
  return delivery;
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

export const sanitizeString = (str) => {
  return str.trim().replace(/[<>]/g, '');
};

export const getMonthName = (month) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month];
};

export const getDaysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

export const calculateAge = (birthDate) => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const generateRandomString = (length = 10) => {
  return Math.random().toString(36).substring(2, length + 2);
};

export const calculatePercentage = (value, total) => {
  return ((value / total) * 100).toFixed(2);
};

export const roundToTwoDecimals = (num) => {
  return Math.round(num * 100) / 100;
};

export const getBatch = (array, size) => {
  const batches = [];
  for (let i = 0; i < array.length; i += size) {
    batches.push(array.slice(i, i + size));
  }
  return batches;
};

export const removeDuplicates = (array) => {
  return [...new Set(array)];
};

export const sortByProperty = (array, property, order = 'asc') => {
  return array.sort((a, b) => {
    if (order === 'asc') {
      return a[property] > b[property] ? 1 : -1;
    }
    return a[property] < b[property] ? 1 : -1;
  });
};

export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

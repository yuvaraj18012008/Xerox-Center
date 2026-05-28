import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, passwordData) => api.post(`/auth/reset-password/${token}`, passwordData),
  changePassword: (passwordData) => api.post('/auth/change-password', passwordData),
  getMe: () => api.get('/auth/me'),
  firebaseSync: (syncData) => api.post('/auth/firebase-sync', syncData)
};

// Order Services
export const orderService = {
  createOrder: (formData) => api.post('/orders', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000 // 60s for file uploads
  }),
  getOrders: (page = 1, limit = 10) => api.get(`/orders?page=${page}&limit=${limit}`),
  getOrderById: (orderId) => api.get(`/orders/${orderId}`),
  trackOrder: (orderId) => api.get(`/orders/track/${orderId}`),
  updateOrder: (orderId, updateData) => api.put(`/orders/${orderId}`, updateData),
  cancelOrder: (orderId) => api.post(`/orders/${orderId}/cancel`),
  downloadInvoice: (orderId) => api.get(`/orders/${orderId}/invoice`, { responseType: 'blob' })
};

// Service Services
export const serviceService = {
  getServices: () => api.get('/services'),
  getServiceById: (serviceId) => api.get(`/services/${serviceId}`)
};

// Payment Services
export const paymentService = {
  initiatePayment: (paymentData) => api.post('/payments/initiate', paymentData),
  verifyPayment: (paymentId, verificationData) => api.post(`/payments/${paymentId}/verify`, verificationData),
  getPaymentStatus: (paymentId) => api.get(`/payments/${paymentId}/status`)
};

// User Services
export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  changePassword: (passwordData) => api.post('/users/change-password', passwordData),
  getOrderHistory: () => api.get('/users/orders'),
  addSavedAddress: (address) => api.post('/users/addresses', address),
  removeSavedAddress: (addressId) => api.delete(`/users/addresses/${addressId}`)
};

// Admin Services
export const adminService = {
  getDashboardStats: () => api.get('/admin/stats'),
  getAllOrders: (filters) => api.get('/admin/orders', { params: filters }),
  updateOrderStatus: (orderId, status) => api.put(`/admin/orders/${orderId}`, { status }),
  getServices: () => api.get('/admin/services'),
  addService: (serviceData) => api.post('/admin/services', serviceData),
  updateService: (serviceId, serviceData) => api.put(`/admin/services/${serviceId}`, serviceData),
  deleteService: (serviceId) => api.delete(`/admin/services/${serviceId}`),
  getUsers: () => api.get('/admin/users'),
  getSalesReport: (dateRange) => api.get('/admin/reports/sales', { params: dateRange })
};

// Support Services
export const supportService = {
  createTicket: (ticketData) => api.post('/support/tickets', ticketData),
  getTickets: () => api.get('/support/tickets'),
  getTicketById: (ticketId) => api.get(`/support/tickets/${ticketId}`),
  addResponse: (ticketId, responseData) => api.post(`/support/tickets/${ticketId}/responses`, responseData)
};

// Discount Services
export const discountService = {
  validateCoupon: (code) => api.post('/discounts/validate', { code })
};

export default api;

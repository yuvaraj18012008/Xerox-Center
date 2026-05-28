import axios from 'axios';

/**
 * Detect if the app is running on a static host (GitHub Pages)
 * where no backend API is available.
 */
const isStaticHost = false; // We are migrating to a Render backend, so we always use the API.

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Returns a rejected promise with a clear message when backend is unavailable.
 * This prevents any network requests to static hosts that would return 405.
 */
const noBackend = () => Promise.reject(new Error('Backend API is not available on this host'));

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
    if (error.response?.status === 401 && !isStaticHost) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Use hash-based redirect for GitHub Pages compatibility
      const loginPath = window.location.pathname.includes('/Xerox-Center')
        ? '/Xerox-Center/login'
        : '/login';
      window.location.href = loginPath;
    }
    return Promise.reject(error);
  }
);

// Export the static host flag so other modules can use it
export { isStaticHost };

// Auth Services
export const authService = {
  register: (userData) => isStaticHost ? noBackend() : api.post('/auth/register', userData),
  login: (credentials) => isStaticHost ? noBackend() : api.post('/auth/login', credentials),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  verifyEmail: (token) => isStaticHost ? noBackend() : api.get(`/auth/verify-email/${token}`),
  forgotPassword: (email) => isStaticHost ? noBackend() : api.post('/auth/forgot-password', { email }),
  resetPassword: (token, passwordData) => isStaticHost ? noBackend() : api.post(`/auth/reset-password/${token}`, passwordData),
  changePassword: (passwordData) => isStaticHost ? noBackend() : api.post('/auth/change-password', passwordData),
  getMe: () => isStaticHost ? noBackend() : api.get('/auth/me'),
  firebaseSync: (syncData) => isStaticHost ? noBackend() : api.post('/auth/firebase-sync', syncData)
};

// Order Services
export const orderService = {
  createOrder: (formData) => isStaticHost ? noBackend() : api.post('/orders', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000
  }),
  getOrders: (page = 1, limit = 10) => isStaticHost ? noBackend() : api.get(`/orders?page=${page}&limit=${limit}`),
  getOrderById: (orderId) => isStaticHost ? noBackend() : api.get(`/orders/${orderId}`),
  trackOrder: (orderId) => isStaticHost ? noBackend() : api.get(`/orders/track/${orderId}`),
  updateOrder: (orderId, updateData) => isStaticHost ? noBackend() : api.put(`/orders/${orderId}`, updateData),
  cancelOrder: (orderId) => isStaticHost ? noBackend() : api.post(`/orders/${orderId}/cancel`),
  downloadInvoice: (orderId) => isStaticHost ? noBackend() : api.get(`/orders/${orderId}/invoice`, { responseType: 'blob' })
};

// Service Services
export const serviceService = {
  getServices: () => isStaticHost ? noBackend() : api.get('/services'),
  getServiceById: (serviceId) => isStaticHost ? noBackend() : api.get(`/services/${serviceId}`)
};

// Payment Services
export const paymentService = {
  initiatePayment: (paymentData) => isStaticHost ? noBackend() : api.post('/payments/initiate', paymentData),
  verifyPayment: (paymentId, verificationData) => isStaticHost ? noBackend() : api.post(`/payments/${paymentId}/verify`, verificationData),
  getPaymentStatus: (paymentId) => isStaticHost ? noBackend() : api.get(`/payments/${paymentId}/status`)
};

// User Services
export const userService = {
  getProfile: () => isStaticHost ? noBackend() : api.get('/users/profile'),
  updateProfile: (userData) => isStaticHost ? noBackend() : api.put('/users/profile', userData),
  changePassword: (passwordData) => isStaticHost ? noBackend() : api.post('/users/change-password', passwordData),
  getOrderHistory: () => isStaticHost ? noBackend() : api.get('/users/orders'),
  addSavedAddress: (address) => isStaticHost ? noBackend() : api.post('/users/addresses', address),
  removeSavedAddress: (addressId) => isStaticHost ? noBackend() : api.delete(`/users/addresses/${addressId}`)
};

// Admin Services
export const adminService = {
  getDashboardStats: () => isStaticHost ? noBackend() : api.get('/admin/stats'),
  getAllOrders: (filters) => isStaticHost ? noBackend() : api.get('/admin/orders', { params: filters }),
  updateOrderStatus: (orderId, status) => isStaticHost ? noBackend() : api.put(`/admin/orders/${orderId}`, { status }),
  getServices: () => isStaticHost ? noBackend() : api.get('/admin/services'),
  addService: (serviceData) => isStaticHost ? noBackend() : api.post('/admin/services', serviceData),
  updateService: (serviceId, serviceData) => isStaticHost ? noBackend() : api.put(`/admin/services/${serviceId}`, serviceData),
  deleteService: (serviceId) => isStaticHost ? noBackend() : api.delete(`/admin/services/${serviceId}`),
  getUsers: () => isStaticHost ? noBackend() : api.get('/admin/users'),
  getSalesReport: (dateRange) => isStaticHost ? noBackend() : api.get('/admin/reports/sales', { params: dateRange })
};

// Support Services
export const supportService = {
  createTicket: (ticketData) => isStaticHost ? noBackend() : api.post('/support/tickets', ticketData),
  getTickets: () => isStaticHost ? noBackend() : api.get('/support/tickets'),
  getTicketById: (ticketId) => isStaticHost ? noBackend() : api.get(`/support/tickets/${ticketId}`),
  addResponse: (ticketId, responseData) => isStaticHost ? noBackend() : api.post(`/support/tickets/${ticketId}/responses`, responseData)
};

// Discount Services
export const discountService = {
  validateCoupon: (code) => isStaticHost ? noBackend() : api.post('/discounts/validate', { code })
};

export default api;

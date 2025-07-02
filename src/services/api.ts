import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const login = async (data: { email: string; password: string }) => {
  const response = await api.post('/auth/login', data);
  const { token } = response.data;
  if (token) {
    localStorage.setItem('token', token);
  }
  return response;
};

export const register = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await api.post('/auth/register', data);
  const { token } = response.data;
  if (token) {
    localStorage.setItem('token', token);
  }
  return response;
};

export const getCurrentUser = () => api.get('/auth/me');

export const updateProfile = (data: any) => api.put('/auth/update-profile', data);

export const logout = async () => {
  const response = await api.post('/auth/logout');
  localStorage.removeItem('token');
  return response;
};

// Admin endpoints
export const adminApi = {
  // Users
  getUsers: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get('/admin/users', { params }),

  createUser: (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) => api.post('/admin/users', data),

  updateUserRole: (userId: string, role: string) =>
    api.patch(`/admin/users/${userId}/role`, { role }),

  deleteUser: (userId: string) => api.delete(`/admin/users/${userId}`),

  // Orders
  getOrders: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) => api.get('/admin/orders', { params }),

  updateOrderStatus: (orderId: string, status: string) =>
    api.patch(`/admin/orders/${orderId}/status`, { status }),

  // Bookings
  getBookings: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) => api.get('/admin/bookings', { params }),

  updateBookingStatus: (bookingId: string, status: string) =>
    api.patch(`/admin/bookings/${bookingId}/status`, { status }),

  // Analytics
  getAnalytics: (timeframe: 'week' | 'month' | 'year' = 'week') =>
    api.get('/admin/analytics', { params: { timeframe } }),
};

// Product endpoints
export const productApi = {
  getAllProducts: () => api.get('/products'),
  getProductById: (productId: string) => api.get(`/products/${productId}`),
  addReview: (productId: string, reviewData: { 
    rating: number; 
    comment: string;
    productName?: string;
    productDescription?: string;
    productPrice?: number;
    productCategory?: string;
    productImage?: string;
    isVeg?: boolean;
    isBestSeller?: boolean;
  }) => 
    api.post(`/products/${productId}/reviews`, reviewData),
  updateReview: (productId: string, reviewId: string, reviewData: { rating: number; comment: string }) => 
    api.put(`/products/${productId}/reviews/${reviewId}`, reviewData),
  deleteReview: (productId: string, reviewId: string) => 
    api.delete(`/products/${productId}/reviews/${reviewId}`),
};

// Table booking endpoints
export const bookTable = (data: any) => api.post('/table', data);

export const getMyBookings = () => api.get('/table/my-bookings');

export const cancelBooking = (bookingId: string) =>
  api.delete(`/table/bookings/${bookingId}`);

// Payment endpoints
export const createPaymentIntent = (amount: number) =>
  api.post('/payment/create-intent', { amount });

export const getMyOrders = () => api.get('/payment/my-orders');

export default api; 
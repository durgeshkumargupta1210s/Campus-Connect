import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  // Add Clerk token if needed
  return config;
});

// Event APIs
export const eventAPI = {
  getAll: () => api.get('/events'),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
};

// Show APIs
export const showAPI = {
  getAll: () => api.get('/shows'),
  getById: (id) => api.get(`/shows/${id}`),
  getByEventId: (eventId) => api.get(`/shows/event/${eventId}`),
  getAvailableSeats: (id) => api.get(`/shows/${id}/seats`),
  create: (data) => api.post('/shows', data),
  update: (id, data) => api.put(`/shows/${id}`, data),
  delete: (id) => api.delete(`/shows/${id}`),
};

// Booking APIs
export const bookingAPI = {
  getAll: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  getByUserId: (userId) => api.get(`/bookings/user/${userId}`),
  create: (data) => api.post('/bookings', data),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
  delete: (id) => api.delete(`/bookings/${id}`),
};

// User APIs
export const userAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  getProfile: (id) => api.get(`/users/${id}/profile`),
  upsert: (data) => api.post('/users', data),
  delete: (id) => api.delete(`/users/${id}`),
};

// Admin APIs
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getRecentBookings: (limit = 10) => api.get(`/admin/bookings/recent?limit=${limit}`),
  getEventsWithStats: () => api.get('/admin/events/stats'),
};

export default api;

// Frontend API Configuration
// Place this file in: campus-connect-hub/src/config/api.js

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout'
  },

  // Users
  USERS: {
    GET_PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    UPLOAD_RESUME: '/users/resume',
    GET_USER: (id) => `/users/${id}`,
    GET_ALL_USERS: '/users'
  },

  // Events
  EVENTS: {
    GET_ALL: '/events',
    GET_UPCOMING: '/events/upcoming',
    GET_ONE: (id) => `/events/${id}`,
    CREATE: '/events',
    UPDATE: (id) => `/events/${id}`,
    DELETE: (id) => `/events/${id}`
  },

  // Clubs
  CLUBS: {
    GET_ALL: '/clubs',
    GET_ONE: (id) => `/clubs/${id}`,
    CREATE: '/clubs',
    UPDATE: (id) => `/clubs/${id}`,
    DELETE: (id) => `/clubs/${id}`,
    JOIN: (id) => `/clubs/${id}/join`,
    LEAVE: (id) => `/clubs/${id}/leave`
  },

  // Opportunities
  OPPORTUNITIES: {
    GET_ALL: '/opportunities',
    GET_ONE: (id) => `/opportunities/${id}`,
    CREATE: '/opportunities',
    APPLY: (id) => `/opportunities/${id}/apply`,
    DELETE: (id) => `/opportunities/${id}`
  },

  // Registrations
  REGISTRATIONS: {
    GET_ALL: '/registrations',
    CREATE: '/registrations',
    CANCEL: (id) => `/registrations/${id}/cancel`
  },

  // Tickets
  TICKETS: {
    GET_ALL: '/tickets',
    GET_ONE: (id) => `/tickets/${id}`,
    CREATE: '/tickets',
    CHECK_IN: (id) => `/tickets/${id}/check-in`
  },

  // Payments
  PAYMENTS: {
    GET_ALL: '/payments',
    GET_ONE: (id) => `/payments/${id}`,
    CREATE: '/payments',
    COMPLETE: (id) => `/payments/${id}/complete`,
    REFUND: (id) => `/payments/${id}/refund`
  },

  // Campus Drives
  CAMPUS_DRIVES: {
    GET_ALL: '/campus-drives',
    GET_ONE: (id) => `/campus-drives/${id}`,
    CREATE: '/campus-drives',
    REGISTER: (id) => `/campus-drives/${id}/register`,
    DELETE: (id) => `/campus-drives/${id}`
  }
};

// API Helper Functions
export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
};

export const get = (endpoint) => 
  apiCall(endpoint, { method: 'GET' });

export const post = (endpoint, data) => 
  apiCall(endpoint, { method: 'POST', body: JSON.stringify(data) });

export const put = (endpoint, data) => 
  apiCall(endpoint, { method: 'PUT', body: JSON.stringify(data) });

export const patch = (endpoint, data) => 
  apiCall(endpoint, { method: 'PATCH', body: JSON.stringify(data) });

export const del = (endpoint) => 
  apiCall(endpoint, { method: 'DELETE' });

// Example usage in React components:
/*
import { post, get, API_ENDPOINTS } from '@/config/api';

// Login
const handleLogin = async (email, password) => {
  try {
    const data = await post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
    localStorage.setItem('authToken', data.token);
    // Redirect to dashboard
  } catch (error) {
    console.error('Login failed:', error.message);
  }
};

// Get events
const handleGetEvents = async () => {
  try {
    const data = await get(API_ENDPOINTS.EVENTS.GET_ALL);
    setEvents(data.events);
  } catch (error) {
    console.error('Failed to fetch events:', error.message);
  }
};

// Create event
const handleCreateEvent = async (eventData) => {
  try {
    const data = await post(API_ENDPOINTS.EVENTS.CREATE, eventData);
    // Handle success
  } catch (error) {
    console.error('Failed to create event:', error.message);
  }
};
*/

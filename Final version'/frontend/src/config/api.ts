// API Configuration and helper functions
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: `${API_BASE_URL}/auth/login`,
  AUTH_REGISTER: `${API_BASE_URL}/auth/register`,
  AUTH_LOGOUT: `${API_BASE_URL}/auth/logout`,
  
  // Users
  USERS_PROFILE: `${API_BASE_URL}/users/profile`,
  USERS_UPDATE: `${API_BASE_URL}/users/profile`,
  USERS_LIST: `${API_BASE_URL}/users`,
  USERS_DELETE: (id: string) => `${API_BASE_URL}/users/${id}`,
  USERS_UPLOAD_RESUME: `${API_BASE_URL}/users/upload-resume`,
  
  // Events
  EVENTS_LIST: `${API_BASE_URL}/events`,
  EVENTS_CREATE: `${API_BASE_URL}/events`,
  EVENTS_GET: (id: string) => `${API_BASE_URL}/events/${id}`,
  EVENTS_UPDATE: (id: string) => `${API_BASE_URL}/events/${id}`,
  EVENTS_DELETE: (id: string) => `${API_BASE_URL}/events/${id}`,
  EVENTS_UPCOMING: `${API_BASE_URL}/events/upcoming`,
  EVENTS_MY: `${API_BASE_URL}/events/my-events`,
  
  // Clubs
  CLUBS_LIST: `${API_BASE_URL}/clubs`,
  CLUBS_CREATE: `${API_BASE_URL}/clubs`,
  CLUBS_GET: (id: string) => `${API_BASE_URL}/clubs/${id}`,
  CLUBS_UPDATE: (id: string) => `${API_BASE_URL}/clubs/${id}`,
  CLUBS_DELETE: (id: string) => `${API_BASE_URL}/clubs/${id}`,
  CLUBS_JOIN: (id: string) => `${API_BASE_URL}/clubs/${id}/join`,
  CLUBS_LEAVE: (id: string) => `${API_BASE_URL}/clubs/${id}/leave`,
  
  // Opportunities
  OPPORTUNITIES_LIST: `${API_BASE_URL}/opportunities`,
  OPPORTUNITIES_CREATE: `${API_BASE_URL}/opportunities`,
  OPPORTUNITIES_GET: (id: string) => `${API_BASE_URL}/opportunities/${id}`,
  OPPORTUNITIES_UPDATE: (id: string) => `${API_BASE_URL}/opportunities/${id}`,
  OPPORTUNITIES_DELETE: (id: string) => `${API_BASE_URL}/opportunities/${id}`,
  OPPORTUNITIES_APPLY: (id: string) => `${API_BASE_URL}/opportunities/${id}/apply`,
  OPPORTUNITIES_MY_APPLICATIONS: `${API_BASE_URL}/opportunities/my-applications`,
  
  // Registrations
  REGISTRATIONS_LIST: `${API_BASE_URL}/registrations`,
  REGISTRATIONS_CREATE: `${API_BASE_URL}/registrations`,
  REGISTRATIONS_GET: (id: string) => `${API_BASE_URL}/registrations/${id}`,
  REGISTRATIONS_CANCEL: (id: string) => `${API_BASE_URL}/registrations/${id}`,
  
  // Tickets
  TICKETS_CREATE: `${API_BASE_URL}/tickets`,
  TICKETS_GET: (id: string) => `${API_BASE_URL}/tickets/${id}`,
  TICKETS_CHECK_IN: (id: string) => `${API_BASE_URL}/tickets/${id}/check-in`,
  
  // Payments
  PAYMENTS_LIST: `${API_BASE_URL}/payments`,
  PAYMENTS_CREATE: `${API_BASE_URL}/payments`,
  PAYMENTS_GET: (id: string) => `${API_BASE_URL}/payments/${id}`,
  PAYMENTS_COMPLETE: (id: string) => `${API_BASE_URL}/payments/${id}/complete`,
  PAYMENTS_REFUND: (id: string) => `${API_BASE_URL}/payments/${id}/refund`,
  
  // Campus Drives
  CAMPUS_DRIVES_LIST: `${API_BASE_URL}/campus-drives`,
  CAMPUS_DRIVES_CREATE: `${API_BASE_URL}/campus-drives`,
  CAMPUS_DRIVES_GET: (id: string) => `${API_BASE_URL}/campus-drives/${id}`,
  CAMPUS_DRIVES_REGISTER: (id: string) => `${API_BASE_URL}/campus-drives/${id}/register`,
  
  // Health check
  HEALTH: `${API_BASE_URL}/health`,
};

// API Helper class
export class APIClient {
  private static token: string | null = null;

  static setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  static getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('authToken');
    }
    return this.token;
  }

  static clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  private static getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = this.getToken();
    if (token) {
      (headers as any)['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Generic fetch method
  static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      // Handle 401 Unauthorized - clear token and redirect to login
      if (response.status === 401) {
        this.clearToken();
        window.location.href = '/login';
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `API Error: ${response.status}`);
      }

      return data as T;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // GET request
  static get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  static post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  static put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  static delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Upload file
  static async uploadFile<T>(endpoint: string, file: File): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = this.getToken();
      const headers: HeadersInit = {};
      
      if (token) {
        (headers as any)['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Upload failed: ${response.status}`);
      }

      return data as T;
    } catch (error) {
      console.error('File Upload Error:', error);
      throw error;
    }
  }
}

// Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'admin' | 'club_head' | 'recruiter';
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'club_head' | 'recruiter';
  phone?: string;
  bio?: string;
  resumeUrl?: string;
  skills?: string[];
  interests?: string[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  registrations: number;
  organizer: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface Club {
  id: string;
  name: string;
  description: string;
  members: number;
  events?: number;
  leader: string;
  logo?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  type: 'internship' | 'job' | 'freelance';
  salary?: string;
  description: string;
  requirements: string[];
  deadline: string;
}

export interface Payment {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  method: string;
  createdAt: string;
}

// Export API_BASE_URL for components that need it
export default API_BASE_URL;

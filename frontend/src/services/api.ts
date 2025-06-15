import axios from 'axios';
import { ApiResponse } from '../types/api.types';

// Basic API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (add authentication token)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (error handling)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);

    if (error.response?.status === 401) {
      // Handle authentication expiration
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// API functions
export const api = {
  // Health check
  health: (): Promise<ApiResponse<any>> =>
    apiClient.get('/health').then((res) => res.data),

  // File related
  uploadFile: (formData: FormData): Promise<ApiResponse<any>> =>
    apiClient
      .post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => res.data),

  getFiles: (): Promise<ApiResponse<any>> =>
    apiClient.get('/files').then((res) => res.data),

  // Security policy related
  getPolicies: (): Promise<ApiResponse<any>> =>
    apiClient.get('/policies').then((res) => res.data),

  // Security event related
  getSecurityEvents: (): Promise<ApiResponse<any>> =>
    apiClient.get('/events').then((res) => res.data),

  // Dashboard statistics
  getDashboardStats: (): Promise<ApiResponse<any>> =>
    apiClient.get('/dashboard/stats').then((res) => res.data),
};

export default apiClient;

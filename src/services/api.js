import axios from 'axios';

const getBaseUrl = () => {
  const hostname = window.location.hostname;
  const isLocal = 
    hostname === 'localhost' || 
    hostname === '127.0.0.1' || 
    hostname.startsWith('192.168.') || 
    hostname.startsWith('10.') || 
    hostname.startsWith('172.');
  
  return isLocal ? `http://${hostname}:8000` : 'https://dental-scan-api.onrender.com';
};

const BASE_URL = getBaseUrl();

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
});

// Add token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth functions
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  googleLogin: (data) => api.post('/auth/google-login', data),
  me: () => api.get('/auth/me'),
};

// Patient functions
export const patientAPI = {
  getAll: () => api.get('/patients'),
  save: (data) => api.post('/patients', data),
};

// Scan functions
export const scanAPI = {
  getAll: () => api.get('/scans'),
  save: (data) => api.post('/scans', data),
  predict: (formData) => api.post('/predict', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// Dashboard
export const dashboardAPI = {
  stats: () => api.get('/dashboard/stats'),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;
// API Configuration for different environments
const getApiBaseUrl = () => {
  // In production, use the Railway backend URL
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL || 'https://your-backend-service.railway.app';
  }
  // In development, use localhost
  return import.meta.env.VITE_API_URL || 'http://localhost:8081';
};

export const API_BASE_URL = getApiBaseUrl();

// API endpoints
export const API_ENDPOINTS = {
  expenses: `${API_BASE_URL}/api/expenses`,
  health: `${API_BASE_URL}/actuator/health`,
};

// API configuration
export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export default API_BASE_URL;
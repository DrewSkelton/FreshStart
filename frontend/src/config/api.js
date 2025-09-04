// API configuration for different environments
const config = {
  development: {
    baseURL: 'http://localhost:3001'
  },
  production: {
    baseURL: '/api'
  }
};

const environment = process.env.NODE_ENV || 'development';
export const API_BASE_URL = config[environment].baseURL;

// API endpoints
export const endpoints = {
  // Auth endpoints
  login: '/auth/login',
  register: '/auth/register',
  
  // Layout endpoints
  createLayout: '/layout/create-layout',
  getLayouts: '/layout/get-layouts',
  getLayout: (id) => `/layout/${id}`,
  getPrediction: '/layout/get-prediction'
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => {
  if (environment === 'production') {
    return endpoint; // Vercel handles the /api prefix automatically
  }
  return `${API_BASE_URL}${endpoint}`;
};

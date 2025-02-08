// Environment configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://194.87.69.156:3002';

// API endpoints
export const API_ENDPOINTS = {
    QUESTIONS: '/api/questions',
    RESULTS: '/api/results',
    ADMIN_LOGIN: '/api/admin/login',
    ADMIN_RESET_DB: '/api/admin/reset-database',
    ADMIN_REINIT_DB: '/api/admin/reinit-db'
} as const;

// Helper function to get full API URL
export function getApiUrl(endpoint: keyof typeof API_ENDPOINTS): string {
    return `${API_BASE_URL}${API_ENDPOINTS[endpoint]}`;
}

// Export configuration for reference
export default {
    apiBaseUrl: API_BASE_URL,
    endpoints: API_ENDPOINTS,
    getApiUrl
};


const fetchWithCredentials = (url: string, options: RequestInit = {}) => {
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
};
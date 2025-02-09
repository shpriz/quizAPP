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

// Fetch wrapper with credentials
export const fetchWithCredentials = (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('adminToken');
  const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers,
  };

  return fetch(url, {
      ...options,
      credentials: 'include', // This is important for CORS with credentials
      headers: headers,
  });
};

// API methods
export const api = {
    get: (url: string) => fetch(`${API_BASE_URL}${url}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    }),
    
    post: (url: string, data: any) => fetch(`${API_BASE_URL}${url}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
    }),
    
    delete: (url: string) => fetch(`${API_BASE_URL}${url}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    }),
    
    getWithHeaders: (url: string, headers: HeadersInit) => fetch(`${API_BASE_URL}${url}`, {
        headers: {
            ...headers,
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        credentials: 'include'
    }),
};

// Export configuration for reference
export default {
    apiBaseUrl: API_BASE_URL,
    endpoints: API_ENDPOINTS,
    getApiUrl,
    api
};
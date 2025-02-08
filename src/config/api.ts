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
    return fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });
};

// API methods
export const api = {
  get: (url: string) => fetchWithCredentials(url),
  getWithHeaders: (url: string, headers: HeadersInit) => fetchWithCredentials(url, {
      headers: headers
  }),
  post: (url: string, data: any) => fetchWithCredentials(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
  }),
  delete: (url: string) => fetchWithCredentials(url, {
      method: 'DELETE',
  }),
};

// Export configuration for reference
export default {
    apiBaseUrl: API_BASE_URL,
    endpoints: API_ENDPOINTS,
    getApiUrl,
    api
};
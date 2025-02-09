
const API_BASE_URL = 'https://stomtest.nsmu.ru:5173/api';

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
export const CONFIG = {
    apiBaseUrl: API_BASE_URL,
    frontendPort: 5173,
    backendPort: 3002
};

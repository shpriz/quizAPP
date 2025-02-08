// Environment configuration
const DEVELOPMENT_API = 'http://localhost:3002';
const PRODUCTION_API = 'https://stomtest.nsmu.ru/api';

// Check if we're in development mode
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Get the base API URL based on environment
export const API_BASE_URL = isDevelopment ? DEVELOPMENT_API : PRODUCTION_API;

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
    isDevelopment,
    apiBaseUrl: API_BASE_URL,
    frontendPort: isDevelopment ? 3000 : 80,
    backendPort: 3002
};

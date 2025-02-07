const isDevelopment = import.meta.env.DEV;
const API_BASE_URL = isDevelopment ? 'http://localhost:3002' : '';

export const API_ENDPOINTS = {
    questions: '/api/questions',
    results: '/api/results',
    adminLogin: '/api/admin/login',
    adminResults: '/api/admin/results',
    exportExcel: '/api/results/excel'
};

export const getApiUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`;

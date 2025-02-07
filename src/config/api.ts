const isDevelopment = import.meta.env.DEV;

// В development используем localhost:3002
// В production используем текущий домен
const API_BASE_URL = isDevelopment 
    ? 'http://localhost:3002' 
    : `${window.location.protocol}//${window.location.host}`;

export const API_ENDPOINTS = {
    questions: '/api/questions',
    results: '/api/results',
    adminLogin: '/api/admin/login',
    adminResults: '/api/admin/results',
    exportExcel: '/api/results/excel'
};

// В режиме разработки и продакшн используем одинаковые пути с /api
export const getApiUrl = (endpoint: string) => {
    return `${API_BASE_URL}${endpoint}`;
};

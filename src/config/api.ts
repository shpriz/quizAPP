const isDevelopment = import.meta.env.DEV;

// В development используем localhost
// В production используем текущий домен
const API_BASE_URL = isDevelopment 
    ? 'http://localhost:3002' 
    : window.location.origin;

export const API_ENDPOINTS = {
    questions: '/api/questions',
    results: '/api/results',
    adminLogin: '/api/admin/login',
    adminResults: '/api/admin/results',
    exportExcel: '/api/results/excel'
};

// В development убираем /api из пути, так как обращаемся напрямую к бэкенду
export const getApiUrl = (endpoint: string) => {
    if (isDevelopment) {
        return `${API_BASE_URL}${endpoint.replace('/api', '')}`;
    }
    return `${API_BASE_URL}${endpoint}`;
};

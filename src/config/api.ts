const isDevelopment = import.meta.env.DEV;

// В development используем прямой URL до бэкенда
// В production используем относительные пути, так как nginx проксирует /api
const API_BASE_URL = isDevelopment ? 'http://localhost:3002' : '';

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
    return endpoint;
};

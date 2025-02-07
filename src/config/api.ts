const isDevelopment = process.env.NODE_ENV === 'development';

// В development используем localhost:3002
// В production используем текущий домен
export const API_ENDPOINTS = {
  questions: '/api/questions',
  results: '/api/results',
  adminLogin: '/api/admin/login',
  resetDatabase: '/api/admin/reset-database',
  reinitDatabase: '/api/admin/reinit-db'
};

export function getApiUrl(endpoint: string): string {
  // Фронтенд на 3000, бэкенд на 3002
  const baseUrl = isDevelopment 
    ? 'http://localhost:3002'
    : 'http://stomtest.nsmu.ru:3002';
  return `${baseUrl}${endpoint}`;
}

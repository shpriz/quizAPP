const API_BASE_URL = '/api'; // Используем относительный путь

export const API_ENDPOINTS = {
  QUESTIONS: '/questions',
  RESULTS: '/results',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_RESET_DB: '/admin/reset-database',
  ADMIN_REINIT_DB: '/admin/reinit-db'
} as const;

export function getApiUrl(endpoint: keyof typeof API_ENDPOINTS): string {
  return `${API_BASE_URL}${API_ENDPOINTS[endpoint]}`;
}

export const api = {
  get: (url: string) => fetch(url, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  }),
  
  post: (url: string, data: any) => fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include'
  }),
  
  delete: (url: string) => fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  }),
  
  getWithHeaders: (url: string, headers: HeadersInit) => fetch(url, {
    headers: {
      ...headers,
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
    },
    credentials: 'include'
  }),
};

export default {
  apiBaseUrl: API_BASE_URL,
  endpoints: API_ENDPOINTS,
  getApiUrl,
  api
};

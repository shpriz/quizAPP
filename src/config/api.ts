const API_BASE_URL = '/api';

export const API_ENDPOINTS = {
  QUESTIONS: '/questions',
  RESULTS: '/results',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_RESET_DB: '/admin/reset-database',
  ADMIN_REINIT_DB: '/admin/reinit-db'
};

export const api = {
  get: async (url: string) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  },

  post: async (url: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  },

  delete: async (url: string) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  },

  getWithHeaders: async (url: string, headers: HeadersInit) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        ...headers,
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  },
};

export function getApiUrl(endpoint: keyof typeof API_ENDPOINTS): string {
  return `${API_BASE_URL}${API_ENDPOINTS[endpoint]}`;
}

export default {
  apiBaseUrl: API_BASE_URL,
  endpoints: API_ENDPOINTS,
  getApiUrl,
  api
};

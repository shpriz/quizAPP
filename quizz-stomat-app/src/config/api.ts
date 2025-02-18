const API_BASE_URL = '/api';

export const API_ENDPOINTS = {
    QUESTIONS: '/questions',
    RESULTS: '/results',
    ADMIN_LOGIN: '/admin/login',
    ADMIN_RESET_DB: '/admin/reset-database',
    ADMIN_REINIT_DB: '/admin/reinit-db'
};

interface ApiError extends Error {
    status?: number;
    data?: any;
}

// Response interfaces
export interface AdminLoginResponse {
    token: string;
    message: string;
}

export interface QuizResultsResponse {
    id: number;
    first_name: string;
    last_name: string;
    total_score: number;
    overall_result: string;
    created_at: string;
    section_scores: {
        section_name: string;
        score: number;
    }[];
}

export interface DatabaseResponse {
    success: boolean;
    message: string;
    ok?: boolean;
    status?: number;
}


export const api = {
    get: async <T>(url: string): Promise<T> => {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            const error = new Error(`HTTP error! status: ${response.status}`) as ApiError;
            error.status = response.status;
            error.data = await response.json().catch(() => null);
            throw error;
        }
        return response.json();
    },

    post: async <T>(url: string, data: any): Promise<T> => {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = new Error(`HTTP error! status: ${response.status}`) as ApiError;
            error.status = response.status;
            error.data = await response.json().catch(() => null);
            throw error;
        }
        return response.json();
    },

    delete: async <T>(url: string): Promise<T> => {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            const error = new Error(`HTTP error! status: ${response.status}`) as ApiError;
            error.status = response.status;
            error.data = await response.json().catch(() => null);
            throw error;
        }
        return response.json();
    },

    getWithHeaders: async (url: string, headers: HeadersInit): Promise<Response> => {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            headers: {
                ...headers,
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            },
        });
        if (!response.ok) {
            const error = new Error(`HTTP error! status: ${response.status}`) as ApiError;
            error.status = response.status;
            error.data = await response.json().catch(() => null);
            throw error;
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
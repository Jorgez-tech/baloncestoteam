import axios from 'axios';

// Cambiar baseURL para asegurar consistencia
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

// La sesión vive en cookies HttpOnly (ADR-004): no se almacenan tokens en el cliente.
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});

const AUTH_ENDPOINTS = ['/auth/login', '/auth/refresh', '/auth/logout'];
const isAuthEndpoint = (url = '') => AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));

let refreshRequest = null;

// Una sola llamada de refresh compartida entre peticiones concurrentes.
const requestRefresh = () => {
    if (!refreshRequest) {
        refreshRequest = apiClient.post('/auth/refresh').finally(() => {
            refreshRequest = null;
        });
    }
    return refreshRequest;
};

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { config, response } = error;
        const status = response?.status;

        // Ante 401 intenta refrescar una sola vez y reintenta la petición original.
        if (status === 401 && config && !config._retry && !isAuthEndpoint(config.url)) {
            config._retry = true;
            try {
                await requestRefresh();
                return apiClient(config);
            } catch (refreshError) {
                // El refresh falló: la sesión expiró. AuthProvider limpia el estado
                // y ProtectedRoute redirige; no forzamos navegación aquí.
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new Event('auth:session-expired'));
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Asegurar que todos los endpoints usen el prefijo /api/v1
export const authAPI = {
    login: (credentials) => apiClient.post('/auth/login', credentials),
    register: (userData) => apiClient.post('/auth/register', userData),
    logout: () => apiClient.post('/auth/logout'),
    getProfile: () => apiClient.get('/auth/profile'),
};

export const playersAPI = {
    getAll: (params = {}) => apiClient.get('/players', { params }),
    getById: (id) => apiClient.get(`/players/${id}`),
    create: (playerData) => apiClient.post('/players', playerData),
    update: (id, playerData) => apiClient.put(`/players/${id}`, playerData),
    delete: (id) => apiClient.delete(`/players/${id}`),
};

export const usersAPI = {
    getAll: (params = {}) => apiClient.get('/users', { params }),
    getById: (id) => apiClient.get(`/users/${id}`),
    update: (id, userData) => apiClient.put(`/users/${id}`, userData),
    delete: (id) => apiClient.delete(`/users/${id}`),
    toggleActive: (id) => apiClient.patch(`/users/${id}/toggle-active`),
};

export const membersAPI = {
    getAll: (params = {}) => apiClient.get('/members', { params }),
    create: (memberData) => apiClient.post('/members', memberData),
    update: (id, memberData) => apiClient.put(`/members/${id}`, memberData),
    getDependents: (memberId) => apiClient.get(`/members/${memberId}/dependents`),
};

export const auditAPI = {
    getAll: (params = {}) => apiClient.get('/audit', { params }),
};

export const imagesAPI = {
    upload: (formData) => apiClient.post('/images/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    getAll: (params = {}) => apiClient.get('/images', { params }),
    delete: (id) => apiClient.delete(`/images/${id}`),
};

export default apiClient;

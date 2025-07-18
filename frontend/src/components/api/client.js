import axios from 'axios';

// Configuración base de axios
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/v1';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Para enviar cookies
});

// Interceptor para agregar token automáticamente
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Token expirado o inválido
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// API methods
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
};

export const imagesAPI = {
    upload: (formData) => apiClient.post('/images/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    getAll: (params = {}) => apiClient.get('/images', { params }),
    delete: (id) => apiClient.delete(`/images/${id}`),
};

export default apiClient;
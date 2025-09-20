import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

// Configurar instancia de Axios
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor de solicitudes para agregar token
apiClient.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        const tokenType = localStorage.getItem('tokenType') || 'Bearer';

        if (accessToken) {
            config.headers.Authorization = `${tokenType} ${accessToken}`;
        }

        // Log de peticiones en desarrollo
        if (process.env.NODE_ENV === 'development') {
            console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
                headers: config.headers,
                data: config.data
            });
        }

        return config;
    },
    (error) => {
        console.error('[API] Request error:', error);
        return Promise.reject(error);
    }
);

// Interceptor de respuestas para manejar errores globales
apiClient.interceptors.response.use(
    (response) => {
        // Log de respuestas exitosas en desarrollo
        if (process.env.NODE_ENV === 'development') {
            console.log(`[API] Response:`, response);
        }

        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Log de errores en desarrollo
        if (process.env.NODE_ENV === 'development') {
            console.error(`[API] Response error:`, error.response || error);
        }

        // Token expirado - intentar refresh automático
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const refreshResponse = await refreshTokens(refreshToken);
                    if (refreshResponse.success) {
                        // Actualizar token en la petición original y reintentarla
                        const newAccessToken = refreshResponse.data.accessToken;
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                        return apiClient(originalRequest);
                    }
                } catch (refreshError) {
                    console.error('[API] Token refresh failed:', refreshError);
                    // Redirigir a login o limpiar sesión
                    localStorage.clear();
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            } else {
                // No hay refresh token, redirigir a login
                localStorage.clear();
                window.location.href = '/login';
            }
        }

        // Rate limiting
        if (error.response?.status === 429) {
            const retryAfter = error.response.headers['retry-after'];
            const message = `Demasiadas peticiones. ${retryAfter ? `Reintentar en ${retryAfter}s.` : 'Espera un momento.'}`;
            toast.warning(message);
        }

        // Account locked
        if (error.response?.status === 423) {
            toast.error('Cuenta temporalmente bloqueada por seguridad.');
        }

        // Server errors
        if (error.response?.status >= 500) {
            toast.error('Error del servidor. Por favor intenta más tarde.');
        }

        return Promise.reject(error);
    }
);

// Función auxiliar para refresh de tokens
const refreshTokens = async (refreshToken) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken
        });

        const { data } = response.data;

        if (data?.accessToken && data?.refreshToken) {
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);

            return {
                success: true,
                data
            };
        }

        throw new Error('Invalid refresh response');
    } catch (error) {
        return {
            success: false,
            error
        };
    }
};

// API Endpoints
export const authAPI = {
    login: async (credentials) => {
        return apiClient.post('/auth/login', credentials);
    },

    register: async (userData) => {
        return apiClient.post('/auth/register', userData);
    },

    logout: async () => {
        return apiClient.post('/auth/logout');
    },

    refresh: async (data) => {
        return apiClient.post('/auth/refresh', data);
    },

    forgotPassword: async (email) => {
        return apiClient.post('/auth/forgot-password', { email });
    },

    resetPassword: async (data) => {
        return apiClient.post('/auth/reset-password', data);
    },

    validateToken: async () => {
        return apiClient.get('/auth/validate');
    }
};

export const playersAPI = {
    getAll: () => apiClient.get('/players'),

    getById: (id) => apiClient.get(`/players/${id}`),

    create: (playerData) => apiClient.post('/players', playerData),

    update: (id, playerData) => apiClient.put(`/players/${id}`, playerData),

    delete: (id) => apiClient.delete(`/players/${id}`),

    uploadImage: (id, imageFile) => {
        const formData = new FormData();
        formData.append('image', imageFile);

        return apiClient.post(`/players/${id}/image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
};

export const usersAPI = {
    getProfile: () => apiClient.get('/users/profile'),

    updateProfile: (userData) => apiClient.put('/users/profile', userData),

    changePassword: (passwordData) => apiClient.put('/users/change-password', passwordData),

    getAll: () => apiClient.get('/users'),

    updateUser: (id, userData) => apiClient.put(`/users/${id}`, userData),

    deleteUser: (id) => apiClient.delete(`/users/${id}`)
};

export const imagesAPI = {
    upload: (imageFile, description) => {
        const formData = new FormData();
        formData.append('image', imageFile);
        if (description) {
            formData.append('description', description);
        }

        return apiClient.post('/images', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    getAll: () => apiClient.get('/images'),

    getById: (id) => apiClient.get(`/images/${id}`),

    delete: (id) => apiClient.delete(`/images/${id}`)
};

// Helper functions
export const handleApiError = (error, defaultMessage = 'Ha ocurrido un error') => {
    if (error.response?.data?.msg) {
        return error.response.data.msg;
    }

    if (error.response?.status === 400) {
        return 'Datos inválidos. Verifica la información ingresada.';
    }

    if (error.response?.status === 404) {
        return 'Recurso no encontrado.';
    }

    if (error.response?.status === 403) {
        return 'No tienes permisos para realizar esta acción.';
    }

    if (error.code === 'NETWORK_ERROR') {
        return 'Error de conexión. Verifica tu internet.';
    }

    return defaultMessage;
};

export const isNetworkError = (error) => {
    return !error.response && (
        error.code === 'NETWORK_ERROR' ||
        error.message === 'Network Error' ||
        error.code === 'ECONNABORTED'
    );
};

export default apiClient;

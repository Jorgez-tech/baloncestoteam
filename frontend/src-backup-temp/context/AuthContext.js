import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/client';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authVersion, setAuthVersion] = useState(0);

    useEffect(() => {
        // Check if user is logged in on app start
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const savedUser = localStorage.getItem('user');

        if (accessToken && refreshToken && savedUser && savedUser !== 'undefined') {
            try {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);

                // Verificar si el accessToken aún es válido
                verifyTokenAndRefreshIfNeeded();
            } catch (error) {
                console.error('Error parsing user data:', error);
                clearAuthData();
            }
        } else {
            clearAuthData();
        }

        setLoading(false);
    }, []);

    const clearAuthData = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('tokenType');
        setUser(null);
    };

    const saveAuthData = (authData) => {
        const { user, accessToken, refreshToken, tokenType } = authData;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('tokenType', tokenType || 'Bearer');

        setUser(user);
        setAuthVersion(v => v + 1);
    };

    const verifyTokenAndRefreshIfNeeded = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) return false;

        try {
            const response = await authAPI.refresh({ refreshToken });
            const newAuthData = response.data.data;

            saveAuthData({
                user: user, // Mantener usuario actual
                ...newAuthData
            });

            return true;
        } catch (error) {
            console.warn('Token refresh failed:', error);
            clearAuthData();
            return false;
        }
    };

    const login = async (credentials) => {
        try {
            setLoading(true);
            const response = await authAPI.login(credentials);
            const { success, data, msg } = response.data;

            if (success && data) {
                saveAuthData(data);
                toast.success(msg || '¡Bienvenido de vuelta!');
                return { success: true, user: data.user };
            } else {
                const errorMsg = msg || 'Error al iniciar sesión';
                return { success: false, error: errorMsg };
            }
        } catch (error) {
            let errorMessage = 'Error al iniciar sesión';

            if (error.response?.data?.msg) {
                errorMessage = error.response.data.msg;
            } else if (error.response?.status === 429) {
                errorMessage = 'Demasiados intentos. Por favor espera un momento.';
            } else if (error.response?.status === 423) {
                errorMessage = 'Cuenta temporalmente bloqueada.';
            } else if (error.code === 'NETWORK_ERROR') {
                errorMessage = 'Error de conexión. Verifica tu internet.';
            }

            console.error('Login error:', error);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            setLoading(true);
            const response = await authAPI.register(userData);
            const { success, data, msg } = response.data;

            if (success && data) {
                saveAuthData(data);
                toast.success(msg || '¡Cuenta creada exitosamente!');
                return { success: true, user: data.user };
            } else {
                const errorMsg = msg || 'Error al crear la cuenta';
                return { success: false, error: errorMsg };
            }
        } catch (error) {
            let errorMessage = 'Error al crear la cuenta';

            if (error.response?.data?.msg) {
                errorMessage = error.response.data.msg;
            } else if (error.response?.data?.errors) {
                // Manejar errores de validación
                const errors = error.response.data.errors;
                errorMessage = errors.map(err => err.message).join(', ');
            } else if (error.response?.status === 429) {
                errorMessage = 'Demasiados intentos de registro. Espera un momento.';
            }

            console.error('Register error:', error);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);

            // Intentar logout en el servidor
            await authAPI.logout();
        } catch (error) {
            console.error('Error during logout:', error);
            // Continuar con logout local aunque falle el servidor
        } finally {
            // Limpiar datos locales siempre
            clearAuthData();
            setAuthVersion(v => v + 1);
            setLoading(false);
            toast.info('Sesión cerrada correctamente');
        }
    };

    const refreshTokens = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        try {
            const response = await authAPI.refresh({ refreshToken });
            const { success, data } = response.data;

            if (success && data) {
                // Actualizar solo los tokens, mantener usuario
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                return true;
            } else {
                throw new Error('Refresh failed');
            }
        } catch (error) {
            clearAuthData();
            toast.error('Sesión expirada. Por favor inicia sesión nuevamente.');
            throw error;
        }
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setAuthVersion(v => v + 1);
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        refreshTokens,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        authVersion,
        // Token utilities
        getAccessToken: () => localStorage.getItem('accessToken'),
        getRefreshToken: () => localStorage.getItem('refreshToken'),
        hasValidTokens: () => {
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');
            return !!(accessToken && refreshToken);
        }
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/client';

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

    useEffect(() => {
        // Verificar si hay sesión activa al iniciar
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser && savedUser !== 'undefined') {
            try {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
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
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const saveAuthData = (authData) => {
        const { user, token } = authData;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
    };

    const login = async (credentials) => {
        try {
            setLoading(true);
            const response = await authAPI.login(credentials);

            // El backend responde directamente con { user, token }
            const { user, token } = response.data;

            if (user && token) {
                saveAuthData({ user, token });
                return { success: true, user };
            } else {
                return { success: false, error: 'Error al iniciar sesión' };
            }
        } catch (error) {
            let errorMessage = 'Error al iniciar sesión';

            if (error.response?.data?.msg) {
                errorMessage = error.response.data.msg;
            } else if (error.response?.status === 429) {
                errorMessage = 'Demasiados intentos. Por favor espera un momento.';
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

            // El backend solo responde con { msg: 'User registered' }
            // NO devuelve token, así que el usuario debe hacer login después
            if (response.status === 201) {
                return {
                    success: true,
                    message: 'Cuenta creada exitosamente. Por favor inicia sesión.'
                };
            } else {
                return { success: false, error: 'Error al crear la cuenta' };
            }
        } catch (error) {
            let errorMessage = 'Error al crear la cuenta';

            if (error.response?.data?.msg) {
                errorMessage = error.response.data.msg;
            } else if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                errorMessage = errors.map(err => err.message).join(', ');
            }

            console.error('Register error:', error);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        clearAuthData();
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        getToken: () => localStorage.getItem('token'),
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

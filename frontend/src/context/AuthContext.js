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

    // La sesión vive en cookies HttpOnly (ADR-004): se hidrata consultando el
    // backend en vez de leer un token desde localStorage.
    useEffect(() => {
        let isMounted = true;

        const hydrateSession = async () => {
            try {
                const response = await authAPI.getProfile();
                if (isMounted && response.data?.user) {
                    setUser(response.data.user);
                }
            } catch (error) {
                if (isMounted) setUser(null);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        const handleSessionExpired = () => setUser(null);

        hydrateSession();
        window.addEventListener('auth:session-expired', handleSessionExpired);

        return () => {
            isMounted = false;
            window.removeEventListener('auth:session-expired', handleSessionExpired);
        };
    }, []);

    const login = async (credentials) => {
        try {
            setLoading(true);
            const response = await authAPI.login(credentials);

            // El backend responde con { user } y fija las cookies HttpOnly.
            const authenticatedUser = response.data?.user;

            if (authenticatedUser) {
                setUser(authenticatedUser);
                return { success: true, user: authenticatedUser };
            }

            return { success: false, error: 'Error al iniciar sesión' };
        } catch (error) {
            let errorMessage = 'Error al iniciar sesión';

            if (error.response?.data?.msg) {
                errorMessage = error.response.data.msg;
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
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

            // El backend solo responde con { message }; el registro no crea sesión.
            if (response.status === 201) {
                return {
                    success: true,
                    message: response.data?.message || 'Cuenta creada exitosamente. Por favor inicia sesión.'
                };
            }
            return { success: false, error: 'Error al crear la cuenta' };
        } catch (error) {
            let errorMessage = 'Error al crear la cuenta';

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.msg) {
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

    const logout = async () => {
        // Limpiamos el estado de inmediato y notificamos al backend para que
        // invalide las cookies HttpOnly.
        setUser(null);
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
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
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

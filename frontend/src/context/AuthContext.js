import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../components/api/client';
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
    // Estado para forzar re-render global tras login/logout
    const [authVersion, setAuthVersion] = useState(0);

    useEffect(() => {
        // Check if user is logged in on app start
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser && savedUser !== 'undefined') {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        } else if (savedUser === 'undefined' || !savedUser || !token) {
            // Clean up corrupted data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }

        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            setLoading(true);
            const response = await authAPI.login(credentials);
            const { user, token } = response.data;

            // Save to localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setUser(user);
            setAuthVersion(v => v + 1); // Forzar re-render global
            toast.success('¡Bienvenido de vuelta!');

            return { success: true, user };
        } catch (error) {
            const message = error.response?.data?.msg || 'Error al iniciar sesión';
            toast.error(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            setLoading(true);
            const response = await authAPI.register(userData);
            const { user, token } = response.data;

            // Save to localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setUser(user);
            toast.success('¡Cuenta creada exitosamente!');

            return { success: true, user };
        } catch (error) {
            const message = error.response?.data?.msg || 'Error al crear la cuenta';
            toast.error(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            // Clear local storage and state
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setAuthVersion(v => v + 1); // Forzar re-render global
            toast.info('Sesión cerrada');
        }
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
        authVersion, // Para forzar re-render en consumidores si es necesario
    };

    return (
        <AuthContext.Provider value={value}>
            {/* authVersion fuerza re-render global */}
            {children}
        </AuthContext.Provider>
    );
};

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente para rutas que solo deben ser accesibles cuando NO se está autenticado
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido a renderizar si no está autenticado
 * @returns {React.ReactNode} - El contenido o redirección
 */
const PublicOnlyRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="loading">Cargando...</div>;
    }

    // Si el usuario está autenticado, redirigir a la página principal o a la página que estaba intentando acceder
    if (user) {
        const fromPath = location.state?.from || '/';
        return <Navigate to={fromPath} replace />;
    }

    return children;
};

export default PublicOnlyRoute;

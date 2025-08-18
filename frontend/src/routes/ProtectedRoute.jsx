import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente para proteger rutas que requieren autenticación
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido a renderizar si está autenticado
 * @param {boolean} props.requireAdmin - Indica si la ruta requiere rol de administrador
 * @returns {React.ReactNode} - El contenido protegido o redirección
 */
const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="loading">Cargando...</div>;
    }

    if (!user) {
        // Guardar la ubicación actual para redirigir después del login
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    if (requireAdmin && user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;

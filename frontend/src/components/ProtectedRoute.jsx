import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente para proteger rutas que requieren autenticación
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente hijo a renderizar si está autenticado
 * @param {boolean} props.requireAdmin - Si true, requiere que el usuario sea admin
 */
const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { user, loading, isAdmin } = useAuth();

    // Mientras carga, mostrar nada o un spinner
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontSize: '1.5em'
            }}>
                Cargando...
            </div>
        );
    }

    // Si no está autenticado, redirigir a login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Si requiere admin pero no lo es, redirigir a home
    if (requireAdmin && !isAdmin) {
        return <Navigate to="/" replace />;
    }

    // Usuario autenticado y autorizado, renderizar componente
    return children;
};

export default ProtectedRoute;

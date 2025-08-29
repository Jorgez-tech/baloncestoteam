import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1';

/**
 * Envía un log de auditoría al backend
 * @param {string} action - La acción realizada (ej: 'admin_access', 'player_delete')
 * @param {string} target - El objetivo de la acción (ID, nombre, etc.)
 * @param {Object} details - Detalles adicionales de la acción
 * @param {string} severity - Severidad del evento ('low', 'medium', 'high', 'critical')
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const sendAuditLog = async (action, target, details = null, severity = 'medium') => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            console.warn('No hay token de autenticación para enviar audit log');
            return null;
        }

        const response = await axios.post(
            `${API_BASE_URL}/audit`,
            {
                action,
                target,
                details,
                severity
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error enviando audit log al servidor:', error);

        // Log local como fallback para desarrollo
        const localLog = {
            action,
            target,
            details,
            severity,
            timestamp: new Date().toISOString(),
            error: error.message
        };
        console.log('[AUDIT-FALLBACK]', localLog);

        return null;
    }
};

/**
 * Obtiene logs de auditoría del backend
 * @param {Object} filters - Filtros para la consulta
 * @param {number} page - Página a obtener
 * @param {number} limit - Límite de resultados por página
 * @returns {Promise<Object>} Logs de auditoría y metadatos de paginación
 */
export const getAuditLogs = async (filters = {}, page = 1, limit = 50) => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('Token de autenticación requerido');
        }

        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...filters
        });

        const response = await axios.get(
            `${API_BASE_URL}/audit?${params}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error obteniendo audit logs:', error);
        throw error;
    }
};

/**
 * Obtiene estadísticas de auditoría
 * @param {number} days - Número de días hacia atrás para las estadísticas
 * @returns {Promise<Object>} Estadísticas de auditoría
 */
export const getAuditStats = async (days = 7) => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('Token de autenticación requerido');
        }

        const response = await axios.get(
            `${API_BASE_URL}/audit/stats?days=${days}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error obteniendo audit stats:', error);
        throw error;
    }
};

/**
 * Constantes para acciones de auditoría
 */
export const AUDIT_ACTIONS = {
    ADMIN_ACCESS: 'admin_access',
    PLAYER_CREATE: 'player_create',
    PLAYER_UPDATE: 'player_update',
    PLAYER_DELETE: 'player_delete',
    USER_CREATE: 'user_create',
    USER_UPDATE: 'user_update',
    USER_DELETE: 'user_delete',
    IMAGE_UPLOAD: 'image_upload',
    IMAGE_DELETE: 'image_delete',
    SYSTEM_CONFIG: 'system_config'
};

/**
 * Constantes para severidad de eventos
 */
export const AUDIT_SEVERITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
};

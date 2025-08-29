const express = require('express');
const AuditLog = require('../models/audit');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// Middleware para verificar permisos de admin
const verifyAdmin = async (req, res, next) => {
    try {
        // Verificar que el usuario esté autenticado
        if (!req.user) {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }

        // Verificar que el usuario sea admin (puedes ajustar esta lógica según tu modelo de usuarios)
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Acceso denegado: se requieren permisos de administrador' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Error verificando permisos de administrador', error: error.message });
    }
};

// Función utilitaria para crear logs de auditoría
const createAuditLog = async (action, target, user, details = null, severity = 'medium', req) => {
    try {
        const auditLog = new AuditLog({
            action,
            target,
            adminUser: user.email,
            adminUserId: user._id,
            details,
            ip: req.ip || req.connection.remoteAddress || 'unknown',
            userAgent: req.get('User-Agent') || 'unknown',
            severity
        });

        await auditLog.save();
        return auditLog;
    } catch (error) {
        console.error('Error creating audit log:', error);
        throw error;
    }
};

// POST /api/audit - Crear entrada de log de auditoría
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { action, target, details, severity } = req.body;

        // Validar campos requeridos
        if (!action || !target) {
            return res.status(400).json({
                message: 'Campos requeridos: action, target'
            });
        }

        const auditLog = await createAuditLog(
            action,
            target,
            req.user,
            details,
            severity || 'medium',
            req
        );

        res.status(201).json({
            message: 'Log de auditoría creado exitosamente',
            auditLog: {
                id: auditLog._id,
                action: auditLog.action,
                target: auditLog.target,
                timestamp: auditLog.timestamp
            }
        });

    } catch (error) {
        console.error('Error creating audit log:', error);
        res.status(500).json({
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

// GET /api/audit - Obtener logs de auditoría (solo admins)
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const {
            page = 1,
            limit = 50,
            action,
            adminUser,
            startDate,
            endDate,
            severity
        } = req.query;

        // Construir filtros
        const filters = {};

        if (action) filters.action = action;
        if (adminUser) filters.adminUser = new RegExp(adminUser, 'i');
        if (severity) filters.severity = severity;

        if (startDate || endDate) {
            filters.timestamp = {};
            if (startDate) filters.timestamp.$gte = new Date(startDate);
            if (endDate) filters.timestamp.$lte = new Date(endDate);
        }

        // Ejecutar consulta con paginación
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { timestamp: -1 },
            populate: {
                path: 'adminUserId',
                select: 'email name'
            }
        };

        const result = await AuditLog.paginate(filters, options);

        res.json({
            auditLogs: result.docs,
            pagination: {
                currentPage: result.page,
                totalPages: result.totalPages,
                totalLogs: result.totalDocs,
                hasNextPage: result.hasNextPage,
                hasPrevPage: result.hasPrevPage
            }
        });

    } catch (error) {
        console.error('Error fetching audit logs:', error);
        res.status(500).json({
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

// GET /api/audit/stats - Obtener estadísticas de auditoría
router.get('/stats', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { days = 7 } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        const stats = await AuditLog.aggregate([
            {
                $match: {
                    timestamp: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: '$action',
                    count: { $sum: 1 },
                    lastOccurrence: { $max: '$timestamp' }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        const totalLogs = await AuditLog.countDocuments({
            timestamp: { $gte: startDate }
        });

        res.json({
            period: `${days} días`,
            totalLogs,
            actionStats: stats
        });

    } catch (error) {
        console.error('Error fetching audit stats:', error);
        res.status(500).json({
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

// Exportar también la función utilitaria para usar en otros routers
module.exports = { router, createAuditLog };

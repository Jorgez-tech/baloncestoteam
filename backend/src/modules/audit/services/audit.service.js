const AuditLog = require('../../../../models/audit_log.model');
const mongoose = require('mongoose');

class AuditService {
    /**
     * Registra una acción en el log de auditoría asíncronamente
     * @param {Object} data 
     * @param {string} data.actorId 
     * @param {string} data.actorEmail 
     * @param {string} data.action 
     * @param {string} data.targetEntity 
     * @param {string} data.targetId 
     * @param {Object} data.metadata 
     * @param {string} data.ip 
     * @param {string} data.userAgent 
     */
    logAction(data) {
        const job = setImmediate(async () => {
            try {
                if (mongoose.connection.readyState !== 1) {
                    return;
                }

                const log = new AuditLog(data);
                await log.save();
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error('[AuditService Error] Fallo al guardar log de auditoría:', error.message);
            }
        });

        if (typeof job.unref === 'function') {
            job.unref();
        }
    }

    /**
     * Reads the audit trail with pagination and optional filters. The log is
     * append-only, so this is the single read path used by the admin dashboard.
     * @param {Object} params
     * @param {number} [params.page]         Página (1-based).
     * @param {number} [params.limit]        Registros por página (máx. 100).
     * @param {string} [params.action]       Filtra por acción exacta.
     * @param {string} [params.targetEntity] Filtra por entidad objetivo.
     * @param {string} [params.actorId]      Filtra por autor (ObjectId).
     * @param {Date}   [params.from]         Fecha mínima del evento.
     * @param {Date}   [params.to]           Fecha máxima del evento.
     */
    async queryLogs({ page = 1, limit = 20, action, targetEntity, actorId, from, to } = {}) {
        const currentPage = Math.max(1, Number(page) || 1);
        const pageSize = Math.min(100, Math.max(1, Number(limit) || 20));

        const filter = {};
        if (action) filter.action = action;
        if (targetEntity) filter.targetEntity = targetEntity;
        if (actorId) filter.actorId = actorId;
        if (from || to) {
            filter.timestamp = {};
            if (from) filter.timestamp.$gte = from;
            if (to) filter.timestamp.$lte = to;
        }

        const [items, total] = await Promise.all([
            AuditLog.find(filter)
                .sort({ timestamp: -1 })
                .skip((currentPage - 1) * pageSize)
                .limit(pageSize)
                .lean(),
            AuditLog.countDocuments(filter)
        ]);

        return {
            items,
            total,
            page: currentPage,
            limit: pageSize,
            totalPages: Math.ceil(total / pageSize)
        };
    }
}

module.exports = new AuditService();

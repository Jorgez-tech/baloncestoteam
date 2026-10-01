const AuditLog = require('../../../../models/audit_log.model');

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
        // Fire and forget: Ejecutar fuera del ciclo de vida del request HTTP
        setImmediate(async () => {
            try {
                const log = new AuditLog(data);
                await log.save();
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error('[AuditService Error] Fallo al guardar log de auditoría:', error.message);
            }
        });
    }
}

module.exports = new AuditService();

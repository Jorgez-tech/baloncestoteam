const auditService = require('../services/audit.service');

class AuditController {
    async getLogs(req, res) {
        try {
            const result = await auditService.queryLogs(req.validatedQuery);
            res.json({
                success: true,
                data: result.items,
                meta: {
                    total: result.total,
                    page: result.page,
                    limit: result.limit,
                    totalPages: result.totalPages,
                },
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new AuditController();

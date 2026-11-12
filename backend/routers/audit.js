const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { requireAdmin } = require('../src/modules/sports/middleware/team.auth');
const auditController = require('../src/modules/audit/controllers/audit.controller');
const { listAuditLogsDto } = require('../src/modules/audit/dtos/audit.dto');

// El registro de auditoría solo puede consultarse con permisos de administrador.
router.get('/', authMiddleware, requireAdmin, listAuditLogsDto, auditController.getLogs);

module.exports = router;

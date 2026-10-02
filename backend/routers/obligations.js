const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { requireAdmin } = require('../src/modules/sports/middleware/team.auth');
const { requireMemberAccess } = require('../src/modules/members/middleware/member.auth');
const paymentController = require('../src/modules/payments/controllers/payment.controller');
const {
    createObligationDto,
    updateObligationStatusDto,
    generateBatchDto,
    validateObjectIdParam
} = require('../src/modules/payments/dtos/payment.dto');

router.use(authMiddleware);

// --- RUTAS DE ADMINISTRADOR ---
// Crear una obligación manual (ej. venta de un uniforme específico)
router.post('/', requireAdmin, createObligationDto, paymentController.createObligation);
// Generación masiva de un periodo (ej. lanzar mensualidad de Abril a todos)
router.post('/batch', requireAdmin, generateBatchDto, paymentController.generateBatch);
// Marcar como pagado o anular (manualmente por el admin por ahora)
router.patch('/:id/status', requireAdmin, updateObligationStatusDto, paymentController.updateStatus);

// --- RUTAS DE ACCESO DE SOCIOS ---
// El socio puede ver su propio estado de cuenta (todas sus cuotas)
router.get('/member/:memberId', requireMemberAccess, validateObjectIdParam('memberId'), paymentController.getMemberObligations);

module.exports = router;

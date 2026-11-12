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

// Webhook para Mercado Pago (Debe ir ANTES del authMiddleware porque no lleva JWT)
router.post('/webhook/mercadopago', paymentController.webhookMercadoPago);

// A partir de aquí, todas las rutas están protegidas
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

// --- INTEGRACIÓN CON MERCADO PAGO ---
// El socio (o admin) genera el link de pago para una cuota específica
router.post('/:id/checkout', validateObjectIdParam('id'), paymentController.createCheckout);

// Webhook para Mercado Pago (no debe requerir authMiddleware porque viene de servidores externos de MP)
// NOTA: Para producción real, esta ruta debería sacarse de `router.use(authMiddleware)` 
// Por lo que la montaremos antes del middleware en una ruta especial o ignoraremos el auth.
// Para arreglar esto limpiamente, exportemos el webhook fuera de router protegido.

module.exports = router;

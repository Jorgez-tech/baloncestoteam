const paymentService = require('../services/payment.service');
const auditService = require('../../audit/services/audit.service');

class PaymentController {
    async createObligation(req, res) {
        try {
            const obligation = await paymentService.createObligation(req.body);
            auditService.logAction({
                actorId: req.user?.id,
                action: 'OBLIGATION_CREATED',
                targetEntity: 'PaymentObligation',
                targetId: obligation._id.toString(),
                metadata: { type: obligation.type, amount: obligation.amount }
            });
            res.status(201).json({ success: true, data: obligation });
        } catch (e) {
            if (e.code === 11000) {
                return res.status(400).json({ success: false, message: 'Ya existe una obligación de este tipo para el mismo periodo (Anti-doble clic).' });
            }
            res.status(400).json({ success: false, message: e.message });
        }
    }

    async getMemberObligations(req, res) {
        try {
            const obligations = await paymentService.getMemberObligations(req.params.memberId);
            res.json({ success: true, data: obligations });
        } catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    }

    async updateStatus(req, res) {
        try {
            const { status, paymentMethod, transactionId } = req.body;
            const obligation = await paymentService.updateStatus(req.params.id, status, { paymentMethod, transactionId });
            
            if (!obligation) return res.status(404).json({ success: false, message: 'Not found' });

            auditService.logAction({
                actorId: req.user?.id,
                action: 'OBLIGATION_UPDATED',
                targetEntity: 'PaymentObligation',
                targetId: obligation._id.toString(),
                metadata: { status }
            });

            res.json({ success: true, data: obligation });
        } catch (e) {
            res.status(400).json({ success: false, message: e.message });
        }
    }

    async generateBatch(req, res) {
        try {
            const result = await paymentService.generateBatchMensualidades(req.body);
            
            auditService.logAction({
                actorId: req.user?.id,
                action: 'OBLIGATION_BATCH_GENERATED',
                targetEntity: 'PaymentObligation',
                metadata: { period: req.body.period, result }
            });

            res.status(201).json({ 
                success: true, 
                message: `Generación masiva completada. Insertadas: ${result.inserted}. Omitidas (ya existían): ${result.skipped}.`,
                data: result 
            });
        } catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    }
}

module.exports = new PaymentController();

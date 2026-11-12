const paymentService = require('../services/payment.service');
const mercadopagoService = require('../services/mercadopago.service');
const auditService = require('../../audit/services/audit.service');
const mailerService = require('../../notifications/services/mailer.service');

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

            // Buscar datos del socio para enviar correo
            const member = await paymentService.getMemberWithUser(obligation.memberId);
            if (member && member.userId) {
                const link = `${process.env.FRONTEND_URL}/payments/${obligation._id}/checkout`;
                await mailerService.sendObligationGeneratedAlert(
                    member.userId.email,
                    member.userId.name || 'Socio',
                    obligation.title,
                    obligation.amount,
                    obligation.dueDate,
                    link
                );
            }

            res.status(201).json({ success: true, data: obligation });
        } catch (e) {
            if (e.code === 11000) {
                return res.status(400).json({ success: false, message: 'Ya existe una obligación de este tipo para el mismo periodo.' });
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
            res.status(e.statusCode || 400).json({ success: false, message: e.message });
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

    // --- INTEGRACIÓN MERCADO PAGO ---

    async createCheckout(req, res) {
        try {
            const obligation = await paymentService.getObligationById(req.params.id);
            if (!obligation) return res.status(404).json({ success: false, message: 'Cuota no encontrada' });
            if (obligation.status === 'paid') return res.status(400).json({ success: false, message: 'La cuota ya está pagada' });

            const member = await paymentService.getMemberWithUser(obligation.memberId);
            if (!member) return res.status(404).json({ success: false, message: 'Socio no encontrado' });

            // Solo el socio dueño de la deuda o el admin pueden generar el link
            if (req.user.role !== 'admin' && member.userId._id.toString() !== req.user.id) {
                return res.status(403).json({ success: false, message: 'Acceso denegado' });
            }

            const preferenceData = await mercadopagoService.createCheckoutPreference(
                obligation,
                member,
                member.userId.email
            );

            res.json({ success: true, data: preferenceData });
        } catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    }

    async webhookMercadoPago(req, res) {
        try {
            // MercadoPago envía 'payment' y su 'id' en los query params o body
            const { type, 'data.id': dataId } = req.query;
            const actionType = req.body?.action || type;
            const paymentId = req.body?.data?.id || dataId;

            // Retornamos 200 OK inmediatamente para evitar que MP reintente
            res.status(200).send('OK');

            if (actionType === 'payment.created' || actionType === 'payment.updated') {
                // Consultamos a MP la info real (seguridad contra spoofing)
                const paymentInfo = await mercadopagoService.getPaymentDetails(paymentId);

                if (paymentInfo.status === 'approved') {
                    const obligationId = paymentInfo.external_reference;
                    if (obligationId) {
                        await paymentService.updateStatus(
                            obligationId,
                            'paid',
                            { paymentMethod: 'mercadopago', transactionId: paymentId.toString() }
                        );

                        auditService.logAction({
                            actorEmail: 'system-webhook',
                            action: 'OBLIGATION_UPDATED',
                            targetEntity: 'PaymentObligation',
                            targetId: obligationId,
                            metadata: { source: 'MercadoPago', status: 'paid', transactionId: paymentId }
                        });
                    }
                }
            }
        } catch (e) {
            auditService.logAction({
                actorEmail: 'system-webhook',
                action: 'OBLIGATION_WEBHOOK_ERROR',
                targetEntity: 'PaymentObligation',
                metadata: {
                    source: 'MercadoPago',
                    message: e.message
                }
            });
        }
    }
}

module.exports = new PaymentController();

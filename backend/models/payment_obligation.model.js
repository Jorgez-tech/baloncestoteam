const mongoose = require('mongoose');
const softDeletePlugin = require('../src/core/plugins/soft-delete.plugin');

const paymentObligationSchema = new mongoose.Schema({
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    title: { type: String, required: true, trim: true }, // Ej: "Mensualidad Abril 2026"
    type: {
        type: String,
        enum: ['mensualidad', 'matricula', 'uniforme', 'otro'],
        required: true
    },
    period: {
        type: String,
        trim: true
        // Obligatorio para mensualidades (Ej: "2026-04")
    },
    amount: { type: Number, required: true, min: 0 },
    // Snapshot de facturación tomado al generar la cuota. Permite recomputar el monto de
    // forma determinista cuando cambia el roster (Ej: un jugador sale del equipo) sin
    // tener que deducir el precio unitario a partir del monto agregado.
    unitAmount: { type: Number, default: null, min: 0 },
    playerCount: { type: Number, default: null, min: 0 },
    dueDate: { type: Date, required: true },
    status: {
        type: String,
        enum: ['pending', 'paid', 'overdue', 'cancelled'],
        default: 'pending'
    },
    paymentDetails: {
        transactionId: { type: String, default: null }, // ID de Webpay o MercadoPago
        paymentMethod: { type: String, default: null }, // 'webpay', 'mercadopago', 'transfer', 'cash'
        paidAt: { type: Date, default: null }
    }
}, { timestamps: true });

// Índices para listados rápidos
paymentObligationSchema.index({ memberId: 1, status: 1 });
paymentObligationSchema.index({ dueDate: 1 });

// PROTECCIÓN ANTI-DOBLE CLIC (Idempotencia en BD)
// Un socio no puede tener dos obligaciones del mismo tipo para el mismo periodo.
paymentObligationSchema.index(
    { memberId: 1, type: 1, period: 1 },
    { unique: true, partialFilterExpression: { period: { $exists: true, $type: 'string' } } }
);

// Financial records must never be removed: the plugin blocks hard deletes. Cancelling a
// fee is a status change (`cancelled`), not a deletion.
paymentObligationSchema.plugin(softDeletePlugin);

module.exports = mongoose.models.PaymentObligation || mongoose.model('PaymentObligation', paymentObligationSchema);

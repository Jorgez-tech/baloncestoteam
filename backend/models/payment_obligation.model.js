const mongoose = require('mongoose');

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

module.exports = mongoose.models.PaymentObligation || mongoose.model('PaymentObligation', paymentObligationSchema);

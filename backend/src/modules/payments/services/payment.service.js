const PaymentObligation = require('../../../../models/payment_obligation.model');
const Member = require('../../../../models/member.model');

class PaymentService {
    async createObligation(data) {
        const obligation = new PaymentObligation(data);
        return obligation.save();
    }

    async getMemberObligations(memberId) {
        return PaymentObligation.find({ memberId }).sort({ dueDate: -1 });
    }

    async updateStatus(id, status, paymentDetails = {}) {
        const updateData = { status };
        if (status === 'paid') {
            updateData['paymentDetails.paidAt'] = new Date();
            if (paymentDetails.paymentMethod) updateData['paymentDetails.paymentMethod'] = paymentDetails.paymentMethod;
            if (paymentDetails.transactionId) updateData['paymentDetails.transactionId'] = paymentDetails.transactionId;
        }

        return PaymentObligation.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    }

    /**
     * Generación masiva de mensualidades seguras.
     * Utiliza insertMany con ordered: false para ignorar los duplicados (protección anti-doble clic)
     * basándose en el índice único (memberId, type, period).
     */
    async generateBatchMensualidades({ title, period, amount, dueDate }) {
        // 1. Obtener todos los socios activos
        const activeMembers = await Member.find({ status: 'active' }).select('_id');
        if (activeMembers.length === 0) return { inserted: 0, skipped: 0 };

        // 2. Preparar los documentos
        const obligations = activeMembers.map(member => ({
            memberId: member._id,
            title,
            type: 'mensualidad',
            period,
            amount,
            dueDate,
            status: 'pending'
        }));

        try {
            // 3. Insertar ignorando duplicados (ordered: false permite que Mongo continúe si hay un E11000)
            const result = await PaymentObligation.insertMany(obligations, { ordered: false });
            return {
                inserted: result.length,
                skipped: 0
            };
        } catch (error) {
            // Si el error es de duplicidad parcial (algunos fallaron por ya existir), Mongo lanza error pero los demás sí se insertan
            if (error.code === 11000 || (error.writeErrors && error.writeErrors.some(e => e.code === 11000))) {
                const insertedCount = error.insertedDocs ? error.insertedDocs.length : 0;
                return {
                    inserted: insertedCount,
                    skipped: obligations.length - insertedCount
                };
            }
            throw error; // Si es otro tipo de error, relanzarlo
        }
    }
}

module.exports = new PaymentService();

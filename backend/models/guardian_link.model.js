const mongoose = require('mongoose');

const guardianLinkSchema = new mongoose.Schema({
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
    relationship: {
        type: String,
        enum: ['parent', 'legal_guardian', 'grandparent', 'other'],
        default: 'parent'
    },
    isFinancialResponsible: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Evitar vínculos duplicados entre el mismo socio y jugador
guardianLinkSchema.index({ memberId: 1, playerId: 1 }, { unique: true });

module.exports = mongoose.models.GuardianLink || mongoose.model('GuardianLink', guardianLinkSchema);

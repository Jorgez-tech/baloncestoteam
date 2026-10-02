const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    memberNumber: { type: String, required: true, unique: true, trim: true },
    status: {
        type: String,
        enum: ['active', 'inactive', 'delinquent'],
        default: 'active'
    },
    joinDate: { type: Date, default: Date.now }
}, { timestamps: true });

// Índice para búsqueda rápida por status
memberSchema.index({ status: 1 });

module.exports = mongoose.models.Member || mongoose.model('Member', memberSchema);

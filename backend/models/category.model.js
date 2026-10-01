const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true }, // Ej: 'U-15', 'Mayor'
    gender: { type: String, enum: ['M', 'F', 'Mixed'], required: true },
    minAge: { type: Number, default: 0 },
    maxAge: { type: Number, default: 99 },
    clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

categorySchema.index({ clubId: 1 });

module.exports = mongoose.models.Category || mongoose.model('Category', categorySchema);

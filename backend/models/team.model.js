const mongoose = require('mongoose');
const softDeletePlugin = require('../src/core/plugins/soft-delete.plugin');

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true }, // Ej: 'Los Toros U-17'
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    season: { type: String, required: true, trim: true }, // Ej: '2026-2027'
    headCoachId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

teamSchema.index({ categoryId: 1 });
teamSchema.index({ season: 1 });
teamSchema.plugin(softDeletePlugin);

module.exports = mongoose.models.Team || mongoose.model('Team', teamSchema);

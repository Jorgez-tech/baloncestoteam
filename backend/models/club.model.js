const mongoose = require('mongoose');
const softDeletePlugin = require('../src/core/plugins/soft-delete.plugin');

const clubSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    logo: { type: String, default: null },
    contactEmail: { type: String, trim: true, lowercase: true },
    address: { type: String, trim: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

clubSchema.plugin(softDeletePlugin);

module.exports = mongoose.models.Club || mongoose.model('Club', clubSchema);

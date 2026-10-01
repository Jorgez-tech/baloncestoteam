const mongoose = require('mongoose');

const passwordResetTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    email: { type: String, required: true },
    codeHash: { type: String, required: true },
    sessionToken: { type: String, default: null }, // Emitido tras verificar el código
    failedAttempts: { type: Number, default: 0 },
    ip: { type: String, default: '0.0.0.0' },
    used: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now, expires: 900 } // TTL 15 minutos (900 segs)
});

passwordResetTokenSchema.index({ email: 1 });
passwordResetTokenSchema.index({ sessionToken: 1 });

const PasswordResetToken = mongoose.models.PasswordResetToken || mongoose.model('PasswordResetToken', passwordResetTokenSchema);
module.exports = PasswordResetToken;

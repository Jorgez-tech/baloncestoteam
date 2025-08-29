const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const auditSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
        enum: [
            'admin_access',
            'player_create',
            'player_update',
            'player_delete',
            'user_create',
            'user_update',
            'user_delete',
            'image_upload',
            'image_delete',
            'system_config'
        ]
    },
    target: {
        type: String,
        required: true,
        description: 'ID or name of the affected resource'
    },
    adminUser: {
        type: String,
        required: true,
        description: 'Email of the admin performing the action'
    },
    adminUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
        description: 'Additional details about the action'
    },
    ip: {
        type: String,
        required: true
    },
    userAgent: {
        type: String,
        required: false
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    }
}, {
    timestamps: true,
    collection: 'audit_logs'
});

// Índices para consultas eficientes
auditSchema.index({ timestamp: -1 });
auditSchema.index({ adminUser: 1, timestamp: -1 });
auditSchema.index({ action: 1, timestamp: -1 });

// Plugin de paginación
auditSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('AuditLog', auditSchema);

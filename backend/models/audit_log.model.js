const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  actorEmail: { type: String, default: 'anonymous' },
  action: { 
    type: String, 
    required: true,
    enum: [
      'LOGIN_SUCCESS', 'LOGIN_FAILED', 'LOGOUT', 
      'PASSWORD_RESET_REQUESTED', 'PASSWORD_RESET_VERIFIED', 'PASSWORD_RESET_COMPLETED',
      'USER_CREATED', 'USER_UPDATED', 'USER_DELETED', 'USER_STATUS_TOGGLED',
      'PLAYER_CREATED', 'PLAYER_UPDATED', 'PLAYER_DELETED',
      'CLUB_CREATED', 'CLUB_UPDATED', 'CLUB_DELETED',
      'CATEGORY_CREATED', 'CATEGORY_UPDATED', 'CATEGORY_DELETED',
      'TEAM_CREATED', 'TEAM_UPDATED', 'TEAM_DELETED'
    ]
  },
  targetEntity: { type: String, required: true }, // 'User', 'Player', 'Auth', 'Club', 'Category', 'Team'
  targetId: { type: String, default: null },
  metadata: { type: Object, default: {} },
  ip: { type: String, default: '0.0.0.0' },
  userAgent: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: false });

auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ actorId: 1 });
auditLogSchema.index({ action: 1 });

const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
module.exports = AuditLog;

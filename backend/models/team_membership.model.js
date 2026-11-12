const mongoose = require('mongoose');

/**
 * TeamMembership: asignación contextual (userId, teamId, rol).
 * El rol 'admin' vive en User.role (control total del club).
 * Los roles deportivos (coach, staff) viven aquí, scoped por equipo.
 */
const teamMembershipSchema = new mongoose.Schema({
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        enum: ['head_coach', 'asst_coach', 'staff', 'scorekeeper'],
        required: true
    },
    // null = permanente mientras el equipo esté activo
    // Date = roles temporales (guest coach, scorekeeper de partido)
    expiresAt: { type: Date, default: null },
    status: {
        type: String,
        enum: ['active', 'suspended'],
        default: 'active'
    }
}, { timestamps: true });

// Un usuario solo puede tener UN rol por equipo simultáneamente
teamMembershipSchema.index({ teamId: 1, userId: 1 }, { unique: true });
teamMembershipSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.models.TeamMembership ||
    mongoose.model('TeamMembership', teamMembershipSchema);

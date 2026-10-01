const mongoose = require('mongoose');

const teamPlayerSchema = new mongoose.Schema({
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
    jerseyNumber: { type: Number, default: null },
    position: { 
        type: String, 
        enum: ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center', 'Unknown'],
        default: 'Unknown'
    },
    status: { 
        type: String, 
        enum: ['Active', 'Injured', 'Suspended', 'Inactive'],
        default: 'Active'
    },
    joinedAt: { type: Date, default: Date.now },
    leftAt: { type: Date, default: null }
}, { timestamps: true });

// Índices para búsquedas rápidas
teamPlayerSchema.index({ teamId: 1, playerId: 1 }, { unique: true, partialFilterExpression: { status: { $ne: 'Inactive' } } });
teamPlayerSchema.index({ teamId: 1, jerseyNumber: 1 });

module.exports = mongoose.models.TeamPlayer || mongoose.model('TeamPlayer', teamPlayerSchema);

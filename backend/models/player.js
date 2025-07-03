const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    position: {
        type: String,
        required: true,
        enum: ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center']
    },
    height: {
        type: Number,
        required: true,
        min: 150,
        max: 230
    },
    weight: {
        type: Number,
        required: true,
        min: 50,
        max: 150
    },
    jersey_number: {
        type: Number,
        min: 1,
        max: 99
    },
    age: {
        type: Number,
        min: 16,
        max: 50
    },
    avatar: {
        type: String,
        default: null
    },
    stats: {
        games_played: { type: Number, default: 0, min: 0 },
        points_per_game: { type: Number, default: 0, min: 0 },
        rebounds_per_game: { type: Number, default: 0, min: 0 },
        assists_per_game: { type: Number, default: 0, min: 0 },
        steals_per_game: { type: Number, default: 0, min: 0 },
        blocks_per_game: { type: Number, default: 0, min: 0 },
        field_goal_percentage: { type: Number, default: 0, min: 0, max: 100 },
        free_throw_percentage: { type: Number, default: 0, min: 0, max: 100 }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    bio: {
        type: String,
        maxlength: 500
    }
}, {
    timestamps: true
});

// Índice para búsquedas por posición
playerSchema.index({ position: 1 });
playerSchema.index({ user_id: 1 });

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    position: { type: String, required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    stats: {
        games_played: { type: Number, default: 0 },
        points_per_game: { type: Number, default: 0 },
        rebounds_per_game: { type: Number, default: 0 },
        assists_per_game: { type: Number, default: 0 }
    }
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
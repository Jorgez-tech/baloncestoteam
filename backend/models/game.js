const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    opponent: { type: String, required: true },
    location: { type: String, required: true },
    score: {
        team: { type: Number, default: 0 },
        opponent: { type: Number, default: 0 }
    },
    players_stats: [
        {
            player_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
            points: { type: Number, default: 0 },
            rebounds: { type: Number, default: 0 },
            assists: { type: Number, default: 0 }
        }
    ]
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
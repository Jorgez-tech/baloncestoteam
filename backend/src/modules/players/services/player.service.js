const Player = require('../../../../models/player.model');

class PlayerService {
    async listPlayers(query) {
        const {
            page = 1,
            limit = 20,
            position,
            minHeight,
            maxWeight,
            sortBy = 'name',
            order = 'asc',
            search,
        } = query;
        
        const filter = {};

        if (position) filter.position = position;
        if (minHeight) filter.height = { $gte: parseFloat(minHeight) };
        if (maxWeight) filter.weight = { $lte: parseFloat(maxWeight) };
        if (search) filter.name = { $regex: search, $options: 'i' };

        const players = await Player.find(filter)
            .populate('user_id', 'email name isActive')
            .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Player.countDocuments(filter);

        return {
            players,
            meta: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit),
            },
        };
    }

    async getPlayerById(id) {
        const player = await Player.findById(id).populate(
            'user_id',
            'email name isActive createdAt'
        );

        if (!player) return null;

        const playerData = player.toObject();
        const stats = playerData.stats || {};

        playerData.metrics = {
            total_points: Math.round((stats.points_per_game || 0) * (stats.games_played || 0)),
            total_rebounds: Math.round((stats.rebounds_per_game || 0) * (stats.games_played || 0)),
            total_assists: Math.round((stats.assists_per_game || 0) * (stats.games_played || 0)),
            efficiency:
                stats.games_played > 0
                    ? Math.round(
                        ((stats.points_per_game || 0) +
                            (stats.rebounds_per_game || 0) +
                            (stats.assists_per_game || 0)) *
                        10
                    ) / 10
                    : 0,
        };

        return playerData;
    }

    async createPlayer(data) {
        const player = new Player(data);
        await player.save();
        return await Player.findById(player._id).populate('user_id', 'email name');
    }

    async updatePlayer(id, data) {
        return await Player.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).populate('user_id', 'email name');
    }

    async deletePlayer(id) {
        return await Player.findByIdAndDelete(id);
    }
}

module.exports = new PlayerService();

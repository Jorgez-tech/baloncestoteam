const User = require('../../../../models/user.model');
const Player = require('../../../../models/player.model');

class ProfileService {
    async getProfile(userId) {
        const user = await User.findById(userId).select('-password');
        if (!user) return null;

        const profile = user.toObject();

        // A player account also exposes its sports profile.
        if (user.role === 'user') {
            const player = await Player.findOne({ user_id: user._id });
            if (player) {
                profile.player = player;
            }
        }

        return profile;
    }

    async updateProfile(userId, data) {
        return User.findByIdAndUpdate(userId, data, {
            new: true,
            runValidators: true,
        }).select('-password');
    }

    async updatePlayerProfile(userId, data) {
        return Player.findOneAndUpdate({ user_id: userId }, data, {
            new: true,
            runValidators: true,
        });
    }
}

module.exports = new ProfileService();

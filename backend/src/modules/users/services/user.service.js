const User = require('../../../../models/user.model');

class UserService {
    async listUsers() {
        return await User.find()
            .select('-password')
            .sort({ createdAt: -1 });
    }

    async getUserById(id) {
        return await User.findById(id).select('-password');
    }

    async updateUser(id, updateData) {
        return await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');
    }

    async deleteUser(id) {
        // Core entity: users are never physically removed, only flagged as deleted.
        return await User.softDeleteById(id);
    }

    async toggleUserStatus(id) {
        const user = await User.findById(id);
        if (!user) return null;

        user.isActive = !user.isActive;
        await user.save();
        
        return user;
    }
}

module.exports = new UserService();

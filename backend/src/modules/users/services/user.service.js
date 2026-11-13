const User = require('../../../../models/user.model');

class UserService {
    async listUsers(query = {}) {
        const { page, limit, role, isActive, search } = query;

        const filter = {};
        if (role) filter.role = role;
        if (isActive !== undefined) filter.isActive = isActive;
        if (search) filter.name = { $regex: search, $options: 'i' };

        const findQuery = User.find(filter)
            .select('-password')
            .sort({ createdAt: -1 });

        // Pagination stays opt-in so existing consumers still receive the full list.
        if (limit) {
            findQuery.skip(((page || 1) - 1) * limit).limit(limit);
        }

        return findQuery;
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

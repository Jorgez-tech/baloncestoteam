const Club = require('../../../../models/club.model');
const Category = require('../../../../models/category.model');
const Team = require('../../../../models/team.model');

class SportsService {
    // --- CLUBS ---
    async createClub(data) {
        const club = new Club(data);
        return club.save();
    }

    async getClubs(query = {}) {
        return Club.find(query);
    }

    async updateClub(id, data) {
        return Club.findByIdAndUpdate(id, data, { new: true });
    }

    // --- CATEGORIES ---
    async createCategory(data) {
        const category = new Category(data);
        return category.save();
    }

    async getCategories(query = {}) {
        return Category.find(query).populate('clubId', 'name logo');
    }

    async updateCategory(id, data) {
        return Category.findByIdAndUpdate(id, data, { new: true });
    }

    // --- TEAMS ---
    async createTeam(data) {
        const team = new Team(data);
        return team.save();
    }

    async getTeams(query = {}) {
        return Team.find(query)
            .populate({
                path: 'categoryId',
                select: 'name gender minAge maxAge',
                populate: { path: 'clubId', select: 'name' }
            })
            .populate('headCoachId', 'name email');
    }

    async updateTeam(id, data) {
        return Team.findByIdAndUpdate(id, data, { new: true });
    }
}

module.exports = new SportsService();

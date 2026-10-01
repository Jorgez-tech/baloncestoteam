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

    // --- ROSTER (TeamPlayer) ---
    async addPlayerToTeam(teamId, data) {
        const TeamPlayer = require('../../../../models/team_player.model');
        
        // 1. Validate team exists
        const team = await Team.findById(teamId);
        if (!team) throw new Error('Equipo no encontrado');

        // 2. Validate player exists
        const Player = require('../../../../models/player.model');
        const player = await Player.findById(data.playerId);
        if (!player) throw new Error('Jugador no encontrado');

        // 3. Invariant: Player cannot be active twice in the same team
        if (data.status !== 'Inactive') {
            const existingActive = await TeamPlayer.findOne({ 
                teamId, 
                playerId: data.playerId, 
                status: { $ne: 'Inactive' } 
            });
            if (existingActive) throw new Error('El jugador ya está activo o lesionado/suspendido en este equipo');
        }

        // 4. Invariant: Jersey number must be unique among active players in the team
        if (data.jerseyNumber != null && data.status === 'Active') {
            const existingJersey = await TeamPlayer.findOne({
                teamId,
                jerseyNumber: data.jerseyNumber,
                status: 'Active'
            });
            if (existingJersey) throw new Error(`El dorsal ${data.jerseyNumber} ya está en uso por otro jugador activo`);
        }

        const teamPlayer = new TeamPlayer({ ...data, teamId });
        return teamPlayer.save();
    }

    async getTeamRoster(teamId) {
        const TeamPlayer = require('../../../../models/team_player.model');
        return TeamPlayer.find({ teamId })
            .populate('playerId', 'name avatar position height weight')
            .sort({ status: 1, jerseyNumber: 1 });
    }

    async updateTeamPlayer(teamId, playerId, data) {
        const TeamPlayer = require('../../../../models/team_player.model');
        const tp = await TeamPlayer.findOne({ teamId, playerId });
        if (!tp) throw new Error('El jugador no pertenece a este equipo');

        // Validate jersey collision if changed and active
        if (data.jerseyNumber != null && data.jerseyNumber !== tp.jerseyNumber) {
            const status = data.status || tp.status;
            if (status === 'Active') {
                const existingJersey = await TeamPlayer.findOne({
                    teamId,
                    jerseyNumber: data.jerseyNumber,
                    status: 'Active',
                    _id: { $ne: tp._id }
                });
                if (existingJersey) throw new Error(`El dorsal ${data.jerseyNumber} ya está en uso por otro jugador activo`);
            }
        }

        if (data.status === 'Inactive' && !data.leftAt) {
            data.leftAt = new Date();
        }

        return TeamPlayer.findByIdAndUpdate(tp._id, data, { new: true });
    }

    async removePlayerFromTeam(teamId, playerId) {
        const TeamPlayer = require('../../../../models/team_player.model');
        return TeamPlayer.findOneAndUpdate(
            { teamId, playerId }, 
            { status: 'Inactive', leftAt: new Date() }, 
            { new: true }
        );
    }
}

module.exports = new SportsService();

const Club = require('../../../../models/club.model');
const Category = require('../../../../models/category.model');
const Team = require('../../../../models/team.model');

class SportsService {
    /**
     * Applies optional pagination to a find query. When no `limit` is provided the
     * query is returned untouched so existing consumers keep receiving the full list.
     */
    applyPagination(mongooseQuery, page, limit) {
        if (!limit) return mongooseQuery;
        return mongooseQuery.skip(((page || 1) - 1) * limit).limit(limit);
    }

    // --- CLUBS ---
    async createClub(data) {
        const club = new Club(data);
        return club.save();
    }

    async getClubs(query = {}) {
        const { page, limit, ...filter } = query;
        return this.applyPagination(Club.find(filter), page, limit);
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
        const { page, limit, ...filter } = query;
        return this.applyPagination(Category.find(filter).populate('clubId', 'name logo'), page, limit);
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
        const { page, limit, ...filter } = query;
        return this.applyPagination(
            Team.find(filter)
                .populate({
                    path: 'categoryId',
                    select: 'name gender minAge maxAge',
                    populate: { path: 'clubId', select: 'name' }
                })
                .populate('headCoachId', 'name email'),
            page,
            limit
        );
    }

    async updateTeam(id, data) {
        return Team.findByIdAndUpdate(id, data, { new: true });
    }

    /**
     * Resolves the roster of the active season.
     * Inactive teams and roster entries in `Inactive` status are excluded.
     */
    async getActiveSeasonRoster({ season } = {}) {
        const TeamPlayer = require('../../../../models/team_player.model');

        const teamFilter = { isActive: true };
        if (season) {
            teamFilter.season = season;
        }

        const teams = await Team.find(teamFilter)
            .select('_id season')
            .sort({ season: -1, createdAt: -1 })
            .lean();

        if (teams.length === 0) {
            return {
                season: season || null,
                rosterEntries: []
            };
        }

        const resolvedSeason = season || teams[0].season;
        const seasonTeams = teams.filter(team => team.season === resolvedSeason);
        const teamIds = seasonTeams.map(team => team._id);

        const rosterEntries = await TeamPlayer.find({
            teamId: { $in: teamIds },
            status: { $in: ['Active', 'Injured', 'Suspended'] }
        })
            .select('teamId playerId status')
            .lean();

        return {
            season: resolvedSeason,
            rosterEntries
        };
    }

    /**
     * Roster snapshot used by the billing module to know who is competing in the current season.
     */
    async getActiveRosterBillingSnapshot(options = {}) {
        return this.getActiveSeasonRoster(options);
    }

    /**
     * Set of player ids holding an active roster spot in the current season.
     * Used by other modules (e.g. member pre-flight checks) to detect competing players.
     */
    async getActiveRosterPlayerIds(options = {}) {
        const { rosterEntries } = await this.getActiveSeasonRoster(options);
        return new Set(rosterEntries.map(entry => entry.playerId.toString()));
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

        const updated = await TeamPlayer.findByIdAndUpdate(tp._id, data, { new: true });

        if (data.status === 'Inactive' && tp.status !== 'Inactive') {
            await this.reconcileBillingAfterRosterRelease(playerId);
        }

        return updated;
    }

    async removePlayerFromTeam(teamId, playerId) {
        const TeamPlayer = require('../../../../models/team_player.model');
        const rosterEntry = await TeamPlayer.findOneAndUpdate(
            { teamId, playerId },
            { status: 'Inactive', leftAt: new Date() },
            { new: true }
        );

        if (rosterEntry) {
            await this.reconcileBillingAfterRosterRelease(playerId);
        }

        return rosterEntry;
    }

    /**
     * A player leaving the active roster must stop being billed. This bridges the sports
     * and finance domains through a lazy require so no circular import is created between
     * the two services at module load time.
     */
    async reconcileBillingAfterRosterRelease(playerId) {
        const paymentService = require('../../payments/services/payment.service');
        return paymentService.reconcileBillingAfterRosterChange(playerId);
    }
}

module.exports = new SportsService();

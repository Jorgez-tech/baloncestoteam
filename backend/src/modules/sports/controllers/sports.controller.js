const sportsService = require('../services/sports.service');
const auditService = require('../../audit/services/audit.service');

class SportsController {
    // --- CLUBS ---
    async createClub(req, res) {
        try {
            const club = await sportsService.createClub(req.body);
            auditService.logAction({ actorId: req.user?.id, action: 'CLUB_CREATED', targetEntity: 'Club', targetId: club._id });
            res.status(201).json({ success: true, data: club });
        } catch (e) {
            res.status(400).json({ success: false, message: e.message });
        }
    }
    async getClubs(req, res) {
        try {
            const clubs = await sportsService.getClubs(req.validatedQuery);
            res.json({ success: true, data: clubs });
        } catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    }
    async updateClub(req, res) {
        try {
            const club = await sportsService.updateClub(req.params.id, req.body);
            if (!club) return res.status(404).json({ success: false, message: 'Not found' });
            auditService.logAction({ actorId: req.user?.id, action: 'CLUB_UPDATED', targetEntity: 'Club', targetId: club._id });
            res.json({ success: true, data: club });
        } catch (e) {
            res.status(400).json({ success: false, message: e.message });
        }
    }

    // --- CATEGORIES ---
    async createCategory(req, res) {
        try {
            const cat = await sportsService.createCategory(req.body);
            auditService.logAction({ actorId: req.user?.id, action: 'CATEGORY_CREATED', targetEntity: 'Category', targetId: cat._id });
            res.status(201).json({ success: true, data: cat });
        } catch (e) {
            res.status(400).json({ success: false, message: e.message });
        }
    }
    async getCategories(req, res) {
        try {
            const cats = await sportsService.getCategories(req.validatedQuery);
            res.json({ success: true, data: cats });
        } catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    }
    async updateCategory(req, res) {
        try {
            const cat = await sportsService.updateCategory(req.params.id, req.body);
            if (!cat) return res.status(404).json({ success: false, message: 'Not found' });
            auditService.logAction({ actorId: req.user?.id, action: 'CATEGORY_UPDATED', targetEntity: 'Category', targetId: cat._id });
            res.json({ success: true, data: cat });
        } catch (e) {
            res.status(400).json({ success: false, message: e.message });
        }
    }

    // --- TEAMS ---
    async createTeam(req, res) {
        try {
            const team = await sportsService.createTeam(req.body);
            auditService.logAction({ actorId: req.user?.id, action: 'TEAM_CREATED', targetEntity: 'Team', targetId: team._id });
            res.status(201).json({ success: true, data: team });
        } catch (e) {
            res.status(400).json({ success: false, message: e.message });
        }
    }
    async getTeams(req, res) {
        try {
            const teams = await sportsService.getTeams(req.validatedQuery);
            res.json({ success: true, data: teams });
        } catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    }
    async updateTeam(req, res) {
        try {
            const team = await sportsService.updateTeam(req.params.id, req.body);
            if (!team) return res.status(404).json({ success: false, message: 'Not found' });
            auditService.logAction({ actorId: req.user?.id, action: 'TEAM_UPDATED', targetEntity: 'Team', targetId: team._id });
            res.json({ success: true, data: team });
        } catch (e) {
            res.status(400).json({ success: false, message: e.message });
        }
    }

    // --- ROSTER (TeamPlayer) ---
    async addPlayerToTeam(req, res) {
        try {
            const { teamId } = req.params;
            const rosterEntry = await sportsService.addPlayerToTeam(teamId, req.body);
            auditService.logAction({ actorId: req.user?.id, action: 'ROSTER_ADDED', targetEntity: 'TeamPlayer', targetId: rosterEntry._id, metadata: { teamId, playerId: req.body.playerId } });
            res.status(201).json({ success: true, data: rosterEntry });
        } catch (e) {
            res.status(400).json({ success: false, message: e.message });
        }
    }

    async getTeamRoster(req, res) {
        try {
            const roster = await sportsService.getTeamRoster(req.params.teamId);
            res.json({ success: true, data: roster });
        } catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    }

    async updateTeamPlayer(req, res) {
        try {
            const { teamId, playerId } = req.params;
            const rosterEntry = await sportsService.updateTeamPlayer(teamId, playerId, req.body);
            auditService.logAction({ actorId: req.user?.id, action: 'ROSTER_UPDATED', targetEntity: 'TeamPlayer', targetId: rosterEntry._id, metadata: { teamId, playerId } });
            res.json({ success: true, data: rosterEntry });
        } catch (e) {
            res.status(400).json({ success: false, message: e.message });
        }
    }

    async removePlayerFromTeam(req, res) {
        try {
            const { teamId, playerId } = req.params;
            const rosterEntry = await sportsService.removePlayerFromTeam(teamId, playerId);
            auditService.logAction({ actorId: req.user?.id, action: 'ROSTER_REMOVED', targetEntity: 'TeamPlayer', targetId: rosterEntry._id, metadata: { teamId, playerId } });
            res.json({ success: true, message: 'Jugador dado de baja del equipo exitosamente', data: rosterEntry });
        } catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    }
}

module.exports = new SportsController();

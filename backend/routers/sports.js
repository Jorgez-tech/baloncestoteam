const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { requireAdmin, requireTeamAccess } = require('../src/modules/sports/middleware/team.auth');
const sportsController = require('../src/modules/sports/controllers/sports.controller');
const membershipController = require('../src/modules/sports/controllers/membership.controller');
const {
    createClubDto, updateClubDto,
    createCategoryDto, updateCategoryDto,
    createTeamDto, updateTeamDto,
    addPlayerToTeamDto, updateTeamPlayerDto,
    listClubsDto, listCategoriesDto, listTeamsDto,
    validateObjectIdParam
} = require('../src/modules/sports/dtos/sports.dto');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// ── CLUBS (solo admin) ─────────────────────────────────────────────────────
router.post('/clubs', requireAdmin, createClubDto, sportsController.createClub);
router.get('/clubs', listClubsDto, sportsController.getClubs);        // Todos pueden leer
router.put('/clubs/:id', requireAdmin, updateClubDto, sportsController.updateClub);

// ── CATEGORIES (solo admin) ───────────────────────────────────────────────
router.post('/categories', requireAdmin, createCategoryDto, sportsController.createCategory);
router.get('/categories', listCategoriesDto, sportsController.getCategories); // Todos pueden leer
router.put('/categories/:id', requireAdmin, updateCategoryDto, sportsController.updateCategory);

// ── TEAMS (solo admin) ────────────────────────────────────────────────────
router.post('/teams', requireAdmin, createTeamDto, sportsController.createTeam);
router.get('/teams', listTeamsDto, sportsController.getTeams);        // Todos pueden leer
router.put('/teams/:id', requireAdmin, updateTeamDto, sportsController.updateTeam);

// ── STAFF / MEMBRESÍAS (solo admin gestiona, todos pueden leer) ───────────
router.post('/teams/:teamId/staff', requireAdmin, membershipController.assignMember);
router.get('/teams/:teamId/staff', requireTeamAccess('any'), membershipController.getTeamStaff);
router.delete('/teams/:teamId/staff/:userId', requireAdmin, membershipController.revokeMember);

// ── ROSTER (admin O coach del equipo) ────────────────────────────────────
router.post('/teams/:teamId/roster',
    requireTeamAccess('coach'),
    addPlayerToTeamDto,
    sportsController.addPlayerToTeam
);
router.get('/teams/:teamId/roster',
    requireTeamAccess('any'),
    validateObjectIdParam('teamId'),
    sportsController.getTeamRoster
);
router.put('/teams/:teamId/roster/:playerId',
    requireTeamAccess('coach'),
    updateTeamPlayerDto,
    sportsController.updateTeamPlayer
);
router.delete('/teams/:teamId/roster/:playerId',
    requireTeamAccess('coach'),
    validateObjectIdParam('teamId'),
    validateObjectIdParam('playerId'),
    sportsController.removePlayerFromTeam
);

module.exports = router;

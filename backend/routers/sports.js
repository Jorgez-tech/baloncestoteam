const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const sportsController = require('../src/modules/sports/controllers/sports.controller');
const {
    createClubDto, updateClubDto,
    createCategoryDto, updateCategoryDto,
    createTeamDto, updateTeamDto
} = require('../src/modules/sports/dtos/sports.dto');

router.use(authMiddleware); // Todas protegidas

// Clubs
router.post('/clubs', createClubDto, sportsController.createClub);
router.get('/clubs', sportsController.getClubs);
router.put('/clubs/:id', updateClubDto, sportsController.updateClub);

// Categories
router.post('/categories', createCategoryDto, sportsController.createCategory);
router.get('/categories', sportsController.getCategories);
router.put('/categories/:id', updateCategoryDto, sportsController.updateCategory);

// Teams
router.post('/teams', createTeamDto, sportsController.createTeam);
router.get('/teams', sportsController.getTeams);
router.put('/teams/:id', updateTeamDto, sportsController.updateTeam);

module.exports = router;

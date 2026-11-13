const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { optionalAuth } = require('../middleware/auth');
const { createPlayerDto, updatePlayerDto, listPlayersDto, validateObjectIdParam, withValidation } = require('../src/modules/players/dtos/player.dto');
const playerController = require('../src/modules/players/controllers/player.controller');

// GET /api/v1/players - Lectura pública con hidratación opcional de usuario (SPEC §3)
router.get('/', optionalAuth, listPlayersDto, playerController.listPlayers);

// GET /api/v1/players/:id - Lectura pública con hidratación opcional de usuario (SPEC §3)
router.get('/:id', optionalAuth, withValidation([validateObjectIdParam('id')]), playerController.getPlayer);

// POST /api/v1/players
router.post('/', auth, createPlayerDto, playerController.createPlayer);

// PUT /api/v1/players/:id
router.put('/:id', auth, updatePlayerDto, playerController.updatePlayer);

// DELETE /api/v1/players/:id
router.delete('/:id', auth, withValidation([validateObjectIdParam('id')]), playerController.deletePlayer);

module.exports = router;

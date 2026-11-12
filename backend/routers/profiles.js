const express = require('express');
const auth = require('../middleware/auth');
const {
    updateProfileDto,
    updatePlayerProfileDto,
} = require('../src/modules/profiles/dtos/profile.dto');
const profileController = require('../src/modules/profiles/controllers/profile.controller');

const router = express.Router();

// GET /api/v1/profiles/me - Perfil del usuario autenticado
router.get('/me', auth, profileController.getProfile);

// PUT /api/v1/profiles/me - Actualizar perfil propio
router.put('/me', auth, updateProfileDto, profileController.updateProfile);

// PUT /api/v1/profiles/player - Actualizar datos de jugador (solo rol user)
router.put('/player', auth, updatePlayerProfileDto, profileController.updatePlayerProfile);

module.exports = router;

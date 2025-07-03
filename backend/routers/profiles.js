const express = require('express');
const User = require('../models/user');
const Player = require('../models/player');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/v1/profiles/me - Obtener perfil del usuario autenticado
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Si el usuario es jugador, incluir datos del jugador
        let profile = { ...user.toObject() };

        if (user.role === 'user') {
            const player = await Player.findOne({ user_id: user._id });
            if (player) {
                profile.player = player;
            }
        }

        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/v1/profiles/me - Actualizar perfil del usuario autenticado
router.put('/me', auth, async (req, res) => {
    try {
        const { name, email } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { name, email },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(user);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'El email ya está en uso' });
        }
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/v1/profiles/player - Actualizar datos del jugador (solo para usuarios tipo jugador)
router.put('/player', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);

        if (!user || user.role !== 'user') {
            return res.status(403).json({ error: 'Solo los jugadores pueden actualizar estos datos' });
        }

        const player = await Player.findOneAndUpdate(
            { user_id: req.user.userId },
            req.body,
            { new: true, runValidators: true }
        );

        if (!player) {
            return res.status(404).json({ error: 'Perfil de jugador no encontrado' });
        }

        res.json(player);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
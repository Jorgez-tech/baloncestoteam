const profileService = require('../services/profile.service');

class ProfileController {
    async getProfile(req, res) {
        try {
            const profile = await profileService.getProfile(req.user.id);
            if (!profile) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            res.json(profile);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateProfile(req, res) {
        try {
            const user = await profileService.updateProfile(req.user.id, req.body);
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
    }

    async updatePlayerProfile(req, res) {
        try {
            if (req.user.role !== 'user') {
                return res
                    .status(403)
                    .json({ error: 'Solo los jugadores pueden actualizar estos datos' });
            }

            const player = await profileService.updatePlayerProfile(req.user.id, req.body);
            if (!player) {
                return res.status(404).json({ error: 'Perfil de jugador no encontrado' });
            }
            res.json(player);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ProfileController();

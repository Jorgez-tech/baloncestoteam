const playerService = require('../services/player.service');

class PlayerController {
    async listPlayers(req, res) {
        try {
            const result = await playerService.listPlayers(req.query);
            res.json({
                success: true,
                data: result.players,
                meta: result.meta,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener jugadores',
                error: error.message,
            });
        }
    }

    async getPlayer(req, res) {
        try {
            const player = await playerService.getPlayerById(req.params.id);
            if (!player) {
                return res.status(404).json({
                    success: false,
                    message: 'Jugador no encontrado',
                });
            }
            res.json({
                success: true,
                data: player,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener jugador',
                error: error.message,
            });
        }
    }

    async createPlayer(req, res) {
        try {
            const player = await playerService.createPlayer(req.body);
            res.status(201).json({
                success: true,
                message: 'Jugador creado exitosamente',
                data: player,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Error al crear jugador',
                error: error.message,
            });
        }
    }

    async updatePlayer(req, res) {
        try {
            const player = await playerService.updatePlayer(req.params.id, req.body);
            if (!player) {
                return res.status(404).json({
                    success: false,
                    message: 'Jugador no encontrado',
                });
            }
            res.json({
                success: true,
                message: 'Jugador actualizado exitosamente',
                data: player,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Error al actualizar jugador',
                error: error.message,
            });
        }
    }

    async deletePlayer(req, res) {
        try {
            const player = await playerService.deletePlayer(req.params.id);
            if (!player) {
                return res.status(404).json({
                    success: false,
                    message: 'Jugador no encontrado',
                });
            }
            res.json({
                success: true,
                message: 'Jugador eliminado exitosamente',
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al eliminar jugador',
                error: error.message,
            });
        }
    }
}

module.exports = new PlayerController();

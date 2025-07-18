const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Player = require('../models/player');
const mongoose = require('mongoose');

// GET /api/v1/players
// Query: page, limit, position, minHeight, maxWeight, sortBy, order, search
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, position, minHeight, maxWeight, sortBy = 'name', order = 'asc', search } = req.query;
    const filter = {};

    // Aplicar filtros
    if (position) filter.position = position;
    if (minHeight) filter.height = { $gte: parseFloat(minHeight) };
    if (maxWeight) filter.weight = { $lte: parseFloat(maxWeight) };
    if (search) filter.name = { $regex: search, $options: 'i' };

    const players = await Player
      .find(filter)
      .populate('user_id', 'email name isActive')
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Player.countDocuments(filter);

    res.json({
      success: true,
      data: players,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener jugadores',
      error: error.message
    });
  }
});

// GET /api/v1/players/:id - Obtener jugador individual
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de jugador inválido'
      });
    }

    // Buscar jugador con información del usuario relacionado
    const player = await Player.findById(id).populate('user_id', 'email name isActive createdAt');

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Jugador no encontrado'
      });
    }

    // Calcular estadísticas adicionales
    const playerData = player.toObject();
    const stats = playerData.stats || {};

    // Agregar métricas calculadas
    playerData.metrics = {
      total_points: Math.round((stats.points_per_game || 0) * (stats.games_played || 0)),
      total_rebounds: Math.round((stats.rebounds_per_game || 0) * (stats.games_played || 0)),
      total_assists: Math.round((stats.assists_per_game || 0) * (stats.games_played || 0)),
      efficiency: stats.games_played > 0 ?
        Math.round(((stats.points_per_game || 0) + (stats.rebounds_per_game || 0) + (stats.assists_per_game || 0)) * 10) / 10 : 0
    };

    res.json({
      success: true,
      data: playerData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener jugador',
      error: error.message
    });
  }
});

// POST /api/v1/players
router.post('/', auth, async (req, res) => {
  try {
    const player = new Player(req.body);
    await player.save();

    // Obtener el jugador con populate para respuesta completa
    const populatedPlayer = await Player.findById(player._id).populate('user_id', 'email name');

    res.status(201).json({
      success: true,
      message: 'Jugador creado exitosamente',
      data: populatedPlayer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear jugador',
      error: error.message
    });
  }
});

// PUT /api/v1/players/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de jugador inválido'
      });
    }

    const player = await Player.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user_id', 'email name');

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Jugador no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Jugador actualizado exitosamente',
      data: player
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar jugador',
      error: error.message
    });
  }
});

// DELETE /api/v1/players/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de jugador inválido'
      });
    }

    const player = await Player.findByIdAndDelete(id);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Jugador no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Jugador eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar jugador',
      error: error.message
    });
  }
});

module.exports = router;
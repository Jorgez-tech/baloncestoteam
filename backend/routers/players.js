const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Player = require('../models/Player');

// GET /api/v1/players
// Query: page, limit, position, minHeight, maxWeight, sortBy, order, search
router.get('/', async (req, res) => {
  const { page=1, limit=20, position, minHeight, maxWeight, sortBy='nombre', order='asc', search } = req.query;
  const filter = {};
  if (position) filter.posición = position;
  if (minHeight) filter.altura = { $gte: parseFloat(minHeight) };
  if (maxWeight) filter.peso = { $lte: parseFloat(maxWeight) };
  if (search) filter.nombre = { $regex: search, $options: 'i' };

  const players = await Player
    .find(filter)
    .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
    .skip((page-1)*limit)
    .limit(parseInt(limit));

  const total = await Player.countDocuments(filter);
  res.json({ data: players, meta: { total, page, limit } });
});

// POST /api/v1/players
router.post('/', auth, async (req, res) => {
  const p = new Player(req.body);
  await p.save();
  res.status(201).json(p);
});

// PUT /api/v1/players/:id
router.put('/:id', auth, async (req, res) => {
  const p = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(p);
});

// DELETE /api/v1/players/:id
router.delete('/:id', auth, async (req, res) => {
  await Player.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Eliminado' });
});

module.exports = router;
const mongoose = require('mongoose');
const Redis = require('ioredis');
const jwt = require('jsonwebtoken');
const redis = require('../config/redis');
require('dotenv').config();

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

  const redisClient = new Redis({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASS
  });

  redisClient.on('connect', () => console.log('Redis connected'));
  module.exports = redisClient;
};

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies['refreshToken'] || req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Si es refresh token, verificar en Redis
    if (payload.type === 'refresh') {
      const exists = await redis.exists(`refresh_${payload.id}`);
      if (!exists) throw new Error('Invalid refresh token');
    }

    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token inválido' });
  }
};
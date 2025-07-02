const jwt = require('jsonwebtoken');
const { getRedisClient } = require('../config/redis');

const authMiddleware = async (req, res, next) => {
    try {
        // Buscar token en header Authorization o en cookies
        const authHeader = req.header('Authorization');
        const token = authHeader?.replace('Bearer ', '') || req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                msg: 'No token provided, authorization denied',
                code: 'NO_TOKEN'
            });
        }

        // Verificar el token JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verificar si el token está en la blacklist (Redis opcional)
        const redisClient = getRedisClient();
        if (redisClient) {
            const isBlacklisted = await redisClient.get(`blacklist_${token}`);
            if (isBlacklisted) {
                return res.status(401).json({
                    msg: 'Token has been revoked',
                    code: 'TOKEN_REVOKED'
                });
            }
        }

        // Agregar datos del usuario al request
        req.user = {
            id: decoded.id || decoded.userId,
            email: decoded.email,
            role: decoded.role || 'user'
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                msg: 'Token expired',
                code: 'TOKEN_EXPIRED'
            });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                msg: 'Invalid token',
                code: 'INVALID_TOKEN'
            });
        } else {
            console.error('Auth middleware error:', error);
            return res.status(500).json({
                msg: 'Server error during authentication',
                code: 'AUTH_ERROR'
            });
        }
    }
};

module.exports = authMiddleware;
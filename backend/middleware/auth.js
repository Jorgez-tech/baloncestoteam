const jwt = require('jsonwebtoken');
const { getRedisClient } = require('../config/redis');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        let token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
        if (!token) token = req.cookies?.accessToken;
        if (!token) token = req.cookies?.token; // Retrocompatibilidad

        if (!token) {
            return res.status(401).json({
                msg: 'No token provided, authorization denied',
                code: 'NO_TOKEN',
            });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res
                .status(500)
                .json({ msg: 'JWT secret not configured', code: 'NO_JWT_SECRET' });
        }

        const decoded = jwt.verify(token, secret);

        const redisClient = getRedisClient?.();
        if (redisClient) {
            try {
                const isBlacklisted = await redisClient.get(`blacklist_${token}`);
                if (isBlacklisted) {
                    return res
                        .status(401)
                        .json({ msg: 'Token has been revoked', code: 'TOKEN_REVOKED' });
                }
            } catch (e) {
                console.warn('Redis check failed, continuing without blacklist');
            }
        }

        req.user = {
            id: decoded.id || decoded.userId,
            email: decoded.email,
            role: decoded.role || 'user',
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'Token expired', code: 'TOKEN_EXPIRED' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ msg: 'Invalid token', code: 'INVALID_TOKEN' });
        }
        console.error('Auth middleware error:', error);
        return res
            .status(500)
            .json({ msg: 'Server error during authentication', code: 'AUTH_ERROR' });
    }
};

/**
 * Optional authentication (SPEC §3). Public read endpoints hydrate `req.user` when a
 * valid token is present but never block anonymous access: a missing, expired or
 * invalid token simply leaves the request as anonymous instead of returning 401.
 */
const optionalAuth = async (req, _res, next) => {
    try {
        const authHeader = req.header('Authorization');
        let token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
        if (!token) token = req.cookies?.accessToken;
        if (!token) token = req.cookies?.token; // Retrocompatibilidad

        if (!token) return next();

        const secret = process.env.JWT_SECRET;
        if (!secret) return next();

        const decoded = jwt.verify(token, secret);

        const redisClient = getRedisClient?.();
        if (redisClient) {
            try {
                const isBlacklisted = await redisClient.get(`blacklist_${token}`);
                if (isBlacklisted) return next();
            } catch (e) {
                console.warn('Redis check failed, continuing without blacklist');
            }
        }

        req.user = {
            id: decoded.id || decoded.userId,
            email: decoded.email,
            role: decoded.role || 'user',
        };

        return next();
    } catch (error) {
        // Any verification failure degrades gracefully to anonymous access.
        return next();
    }
};

authMiddleware.optionalAuth = optionalAuth;

module.exports = authMiddleware;
module.exports.optionalAuth = optionalAuth;

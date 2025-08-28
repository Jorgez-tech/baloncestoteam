const Redis = require('ioredis');
require('dotenv').config();

let redisClient = null;

const connectRedis = () => {
    try {
        redisClient = new Redis({
            host: process.env.REDIS_HOST || '127.0.0.1',
            port: process.env.REDIS_PORT || 6379,
            password: process.env.REDIS_PASS || '',
            retryDelayOnFailover: 100,
            enableReadyCheck: true,
            maxRetriesPerRequest: 3,
            lazyConnect: true, // No conectar inmediatamente
            connectTimeout: 5000,
            commandTimeout: 5000,
        });

        redisClient.on('connect', () => {
            console.log('✅ Redis client connected');
        });

        redisClient.on('error', (err) => {
            console.log('⚠️  Redis client error (continuando sin Redis):', err.message);
            // No terminar el proceso, solo registrar el error
        });

        redisClient.on('ready', () => {
            console.log('✅ Redis client ready');
        });

        redisClient.on('end', () => {
            console.log('📴 Redis client disconnected');
        });

        return redisClient;
    } catch (error) {
        console.warn('⚠️  Error connecting to Redis (continuando sin Redis):', error.message);
        return null;
    }
};

const getRedisClient = () => {
    if (!redisClient) {
        redisClient = connectRedis();
    }
    return redisClient;
};

module.exports = {
    connectRedis,
    getRedisClient,
    redisClient: getRedisClient(),
};

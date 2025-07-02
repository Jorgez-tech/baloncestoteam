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
        });

        redisClient.on('connect', () => {
            console.log('Redis client connected');
        });

        redisClient.on('error', (err) => {
            console.log('Redis client error:', err);
        });

        redisClient.on('ready', () => {
            console.log('Redis client ready');
        });

        redisClient.on('end', () => {
            console.log('Redis client disconnected');
        });

        return redisClient;
    } catch (error) {
        console.error('Error connecting to Redis:', error);
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
    redisClient: getRedisClient()
};
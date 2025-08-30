const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');

// Mock del modelo Player con métodos de Mongoose
jest.mock('../models/player');
jest.mock('../models/user');

const Player = require('../models/player');
// User model imported but not used in current tests

// Mock del middleware de autenticación
jest.mock('../middleware/auth', () => {
    return (req, res, next) => {
        req.user = {
            _id: 'mock-user-id',
            email: 'test@example.com',
            role: 'admin'
        };
        next();
    };
});

// Mock del middleware de validación para simplificar tests
jest.mock('../middleware/validation', () => ({
    validatePlayer: (req, res, next) => next(),
    validatePlayerUpdate: (req, res, next) => next()
}));

const playersRouter = require('../routers/players');

// Crear app de test sin iniciar servidor completo
const createTestApp = () => {
    const app = express();
    app.use(express.json());
    app.use('/api/v1/players', playersRouter);

    // Middleware básico de error
    app.use((err, req, res, _next) => {
        res.status(500).json({
            success: false,
            message: err.message
        });
    });

    return app;
};

describe('Players API', () => {
    let app;
    let testUserId;

    beforeAll(() => {
        app = createTestApp();
        testUserId = new mongoose.Types.ObjectId();
    });

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup default mocks para métodos de Mongoose
        const mockQuery = {
            populate: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            exec: jest.fn()
        };

        Player.find = jest.fn().mockReturnValue(mockQuery);
        Player.countDocuments = jest.fn();
        Player.findById = jest.fn();
        Player.findByIdAndUpdate = jest.fn();
        Player.findByIdAndDelete = jest.fn();
    });

    describe('GET /api/v1/players', () => {
        it('should return empty list when no players exist', async () => {
            // Mock Player.find chain para retornar array vacío
            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue([])
            };
            Player.find.mockReturnValue(mockQuery);
            Player.countDocuments.mockResolvedValue(0);

            const response = await request(app)
                .get('/api/v1/players');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data).toHaveLength(0);
        });

        it('should return players list when players exist', async () => {
            // Mock data
            const mockPlayers = [
                {
                    _id: testUserId,
                    user_id: testUserId,
                    name: 'Test Player',
                    position: 'Point Guard',
                    height: 185,
                    weight: 80
                }
            ];

            // Mock Player.find chain para retornar players
            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(mockPlayers)
            };
            Player.find.mockReturnValue(mockQuery);
            Player.countDocuments.mockResolvedValue(1);

            const response = await request(app)
                .get('/api/v1/players');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0]).toHaveProperty('name', 'Test Player');
            expect(response.body.data[0]).toHaveProperty('position', 'Point Guard');
        });
    });

    describe('POST /api/v1/players', () => {
        it('should create a new player', async () => {
            const newPlayer = {
                user_id: testUserId.toString(),
                name: 'John Doe',
                position: 'Shooting Guard',
                height: 190,
                weight: 85
            };

            const mockCreatedPlayer = {
                _id: new mongoose.Types.ObjectId(),
                ...newPlayer,
                save: jest.fn().mockResolvedValue(true)
            };

            const mockPopulatedPlayer = {
                ...mockCreatedPlayer,
                user_id: {
                    email: 'john@example.com',
                    name: 'John User'
                }
            };

            // Mock constructor de Player
            Player.mockImplementation(() => mockCreatedPlayer);

            // Mock Player.findById con populate
            const mockQuery = {
                populate: jest.fn().mockResolvedValue(mockPopulatedPlayer)
            };
            Player.findById = jest.fn().mockReturnValue(mockQuery);

            const response = await request(app)
                .post('/api/v1/players')
                .send(newPlayer);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('name', 'John Doe');
        });

        it('should return error for invalid player data', async () => {
            const invalidPlayer = {
                name: '', // Nombre vacío
                position: 'InvalidPosition',
                // Faltan user_id, height, weight requeridos
            };

            // Mock Player constructor para lanzar error de validación
            const mockError = new Error('Validation failed');
            mockError.name = 'ValidationError';
            Player.mockImplementation(() => {
                throw mockError;
            });

            const response = await request(app)
                .post('/api/v1/players')
                .send(invalidPlayer);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('message');
        });
    });

    describe('Integration - Basic functionality', () => {
        it('should handle router mounting correctly', () => {
            expect(app).toBeDefined();
            expect(typeof app).toBe('function');
        });

        it('should have proper middleware chain', async () => {
            // Test que el middleware de autenticación está funcionando
            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue([])
            };
            Player.find.mockReturnValue(mockQuery);
            Player.countDocuments.mockResolvedValue(0);

            const response = await request(app)
                .get('/api/v1/players');

            // Verificar que no hay errores de autenticación
            expect(response.status).not.toBe(401);
            expect(response.status).not.toBe(403);
        });
    });
});
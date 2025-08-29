const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Player = require('../models/player');
const User = require('../models/user'); // Importar modelo User

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
    app.use((err, req, res, next) => {
        res.status(500).json({
            success: false,
            message: err.message
        });
    });

    return app;
}; describe('Players API', () => {
    let app;
    let testUserId;

    beforeAll(() => {
        app = createTestApp();
        testUserId = new mongoose.Types.ObjectId();
    });

    describe('GET /api/v1/players', () => {
        it('should return empty list when no players exist', async () => {
            const response = await request(app)
                .get('/api/v1/players')
                .expect(200);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data).toHaveLength(0);
        });

        it('should return players list when players exist', async () => {
            // Crear un jugador de prueba con datos válidos
            const testPlayer = new Player({
                user_id: testUserId.toString(),
                name: 'Test Player',
                position: 'Point Guard',
                height: 185,
                weight: 80
            });
            await testPlayer.save();

            const response = await request(app)
                .get('/api/v1/players');

            // Debug: ver la respuesta completa si falla
            if (response.status !== 200) {
                console.log('Error response:', response.body);
                console.log('Status:', response.status);
            }

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
                user_id: testUserId.toString(), // Convertir a string
                name: 'John Doe',
                position: 'Shooting Guard',
                height: 190,
                weight: 85
            };

            const response = await request(app)
                .post('/api/v1/players')
                .send(newPlayer);

            // Debug: ver la respuesta completa si falla
            if (response.status !== 201) {
                console.log('Create error response:', response.body);
                console.log('Status:', response.status);
                console.log('Sent data:', newPlayer);
            }

            expect(response.status).toBe(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('name', 'John Doe');
            expect(response.body.data).toHaveProperty('_id');

            // Verificar que se guardó en la base de datos
            const savedPlayer = await Player.findById(response.body.data._id);
            expect(savedPlayer).toBeTruthy();
            expect(savedPlayer.name).toBe('John Doe');
        });

        it('should return error for invalid player data', async () => {
            const invalidPlayer = {
                name: '', // Nombre vacío
                position: 'InvalidPosition',
                // Faltan user_id, height, weight requeridos
            };

            const response = await request(app)
                .post('/api/v1/players')
                .send(invalidPlayer)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('message');
        });
    });
});
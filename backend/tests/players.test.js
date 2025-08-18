// backend/tests/players.test.js
const request = require('supertest');
const app = require('../server');
const { Player } = require('../models/player');
require('./setup');

describe('Players API', () => {
    let adminUser;
    let regularUser;
    let adminToken;
    let userToken;

    beforeEach(async () => {
        // Create admin and regular user
        adminUser = await createTestUser({ role: 'admin' });
        regularUser = await createTestUser({
            username: 'regular',
            email: 'regular@example.com',
            role: 'user'
        });

        // Generate tokens for both users
        adminToken = await generateAuthToken(adminUser);
        userToken = await generateAuthToken(regularUser);
    });

    describe('GET /api/players', () => {
        it('should return all players', async () => {
            // Create test players first
            await Player.create([
                {
                    name: 'Test Player 1',
                    position: 'Guard',
                    number: 1,
                    height: 180,
                    stats: { points: 10, rebounds: 5, assists: 3 }
                },
                {
                    name: 'Test Player 2',
                    position: 'Forward',
                    number: 2,
                    height: 195,
                    stats: { points: 15, rebounds: 8, assists: 2 }
                }
            ]);

            const res = await request(app).get('/api/players');

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBe(2);
            expect(res.body[0]).toHaveProperty('name');
            expect(res.body[0]).toHaveProperty('stats');
        });
    });

    describe('GET /api/players/:id', () => {
        it('should return a specific player', async () => {
            // Create a test player
            const player = await Player.create({
                name: 'Test Player',
                position: 'Center',
                number: 33,
                height: 210,
                stats: { points: 20, rebounds: 12, assists: 1 }
            });

            const res = await request(app).get(`/api/players/${player._id}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('name', 'Test Player');
            expect(res.body).toHaveProperty('position', 'Center');
        });

        it('should return 404 for non-existent player', async () => {
            const res = await request(app).get('/api/players/60f1b5b5b5b5b5b5b5b5b5b5');

            expect(res.statusCode).toBe(404);
        });
    });

    describe('POST /api/players', () => {
        it('should create a new player when admin', async () => {
            const playerData = {
                name: 'New Player',
                position: 'Forward',
                number: 23,
                height: 198,
                stats: { points: 17, rebounds: 7, assists: 5 }
            };

            const res = await request(app)
                .post('/api/players')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(playerData);

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('name', 'New Player');
            expect(res.body).toHaveProperty('_id');
        });

        it('should return 403 when non-admin tries to create player', async () => {
            const playerData = {
                name: 'New Player',
                position: 'Forward',
                number: 23,
                height: 198
            };

            const res = await request(app)
                .post('/api/players')
                .set('Authorization', `Bearer ${userToken}`)
                .send(playerData);

            expect(res.statusCode).toBe(403);
        });
    });

    describe('PUT /api/players/:id', () => {
        it('should update a player when admin', async () => {
            // Create a test player
            const player = await Player.create({
                name: 'Update Player',
                position: 'Guard',
                number: 5,
                height: 185,
                stats: { points: 12, rebounds: 3, assists: 8 }
            });

            const res = await request(app)
                .put(`/api/players/${player._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Updated Name',
                    stats: { points: 15 }
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('name', 'Updated Name');
            expect(res.body.stats).toHaveProperty('points', 15);
            // Other stats should remain unchanged
            expect(res.body.stats).toHaveProperty('rebounds', 3);
        });
    });

    describe('DELETE /api/players/:id', () => {
        it('should delete a player when admin', async () => {
            // Create a test player
            const player = await Player.create({
                name: 'Delete Player',
                position: 'Center',
                number: 55,
                height: 215
            });

            const res = await request(app)
                .delete(`/api/players/${player._id}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);

            // Verify player is deleted
            const deletedPlayer = await Player.findById(player._id);
            expect(deletedPlayer).toBeNull();
        });
    });
});

// backend/tests/auth.test.js
const request = require('supertest');
const app = require('../server');
const { User } = require('../models/user');
require('./setup');

describe('Authentication API', () => {
    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'newuser',
                    email: 'newuser@example.com',
                    password: 'Password123!'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('user');
            expect(res.body.user).toHaveProperty('username', 'newuser');
            expect(res.body).toHaveProperty('token');
        });

        it('should return 400 if email already exists', async () => {
            // Create a user first
            await createTestUser();

            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'duplicate',
                    email: 'test@example.com', // Same email as the created user
                    password: 'Password123!'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login an existing user', async () => {
            // Create a user
            const user = await createTestUser();

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'Password123!'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('user');
            expect(res.body.user).toHaveProperty('username', user.username);
            expect(res.body).toHaveProperty('token');
        });

        it('should return 401 with invalid credentials', async () => {
            // Create a user
            await createTestUser();

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('message');
        });
    });

    describe('GET /api/auth/user', () => {
        it('should get current user profile with valid token', async () => {
            // Create a user and generate token
            const user = await createTestUser();
            const token = await generateAuthToken(user);

            const res = await request(app)
                .get('/api/auth/user')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('username', user.username);
            expect(res.body).toHaveProperty('email', user.email);
        });

        it('should return 401 without auth token', async () => {
            const res = await request(app)
                .get('/api/auth/user');

            expect(res.statusCode).toBe(401);
        });
    });
});

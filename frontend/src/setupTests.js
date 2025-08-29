// frontend/src/setupTests.js
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

// Establish API mocking before all tests.
const server = setupServer(
    // Auth API mocks
    rest.post('/api/auth/login', async (req, res, ctx) => {
        const { email, password } = await req.json();

        if (email === 'admin@example.com' && password === 'password123') {
            return res(
                ctx.json({
                    user: { id: '1', username: 'admin', email: 'admin@example.com', role: 'admin' },
                    token: 'fake-admin-token'
                })
            );
        }

        if (email === 'user@example.com' && password === 'password123') {
            return res(
                ctx.json({
                    user: { id: '2', username: 'user', email: 'user@example.com', role: 'user' },
                    token: 'fake-user-token'
                })
            );
        }

        return res(
            ctx.status(401),
            ctx.json({ message: 'Invalid credentials' })
        );
    }),

    rest.post('/api/auth/register', async (req, res, ctx) => {
        const { username, email, password } = await req.json();

        if (!username || !email || !password) {
            return res(
                ctx.status(400),
                ctx.json({ message: 'All fields are required' })
            );
        }

        return res(
            ctx.status(201),
            ctx.json({
                user: { id: '3', username, email, role: 'user' },
                token: 'fake-new-token'
            })
        );
    }),

    rest.get('/api/auth/user', (req, res, ctx) => {
        const authHeader = req.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res(
                ctx.status(401),
                ctx.json({ message: 'Unauthorized' })
            );
        }

        const token = authHeader.split(' ')[1];

        if (token === 'fake-admin-token') {
            return res(
                ctx.json({ id: '1', username: 'admin', email: 'admin@example.com', role: 'admin' })
            );
        }

        if (token === 'fake-user-token') {
            return res(
                ctx.json({ id: '2', username: 'user', email: 'user@example.com', role: 'user' })
            );
        }

        return res(
            ctx.status(401),
            ctx.json({ message: 'Invalid token' })
        );
    }),

    // Players API mocks
    rest.get('/api/players', (req, res, ctx) => {
        return res(
            ctx.json([
                {
                    _id: '1',
                    name: 'Player One',
                    position: 'Guard',
                    number: 1,
                    stats: { points: 15, rebounds: 3, assists: 8 }
                },
                {
                    _id: '2',
                    name: 'Player Two',
                    position: 'Forward',
                    number: 2,
                    stats: { points: 12, rebounds: 8, assists: 2 }
                }
            ])
        );
    }),

    rest.get('/api/players/:id', (req, res, ctx) => {
        const { id } = req.params;

        if (id === '1') {
            return res(
                ctx.json({
                    _id: '1',
                    name: 'Player One',
                    position: 'Guard',
                    number: 1,
                    stats: { points: 15, rebounds: 3, assists: 8 }
                })
            );
        }

        return res(
            ctx.status(404),
            ctx.json({ message: 'Player not found' })
        );
    }),

    // Add more API mocks as needed
);

// Start server before all tests
beforeAll(() => server.listen());

// Reset handlers after each test so that tests are isolated
afterEach(() => server.resetHandlers());

// Close server after all tests
afterAll(() => server.close());

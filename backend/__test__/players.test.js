const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../server');

let mongoServer;
let server;

jest.setTimeout(20000);

beforeAll(async () => {
    // Create MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // Connect to test database
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

afterAll(async () => {
    // Close all database connections
    await mongoose.connection.close();

    // Stop MongoDB Memory Server
    if (mongoServer) {
        await mongoServer.stop();
    }

    // Close any open handles
    if (server && server.close) {
        await new Promise((resolve) => {
            server.close(resolve);
        });
    }

    // Force close any remaining connections
    await mongoose.disconnect();
});

describe('GET /api/v1/players', () => {
    it('should return empty list if no players', async () => {
        const res = await request(app).get('/api/v1/players');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data).toEqual([]);
    });
});

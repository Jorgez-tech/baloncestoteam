// backend/tests/setup.js
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

// Setup in-memory MongoDB server for testing
let mongoServer;

// Setup MongoDB test connection before all tests
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

// Clear all collections after each test
afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
});

// Close connections after all tests
afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
});

// Global utility functions for tests
global.createTestUser = async (userData = {}) => {
    const { User } = require('../models/user');
    const defaultUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123!',
        role: 'user',
        ...userData,
    };

    return await User.create(defaultUser);
};

global.generateAuthToken = async (user) => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
    return token;
};

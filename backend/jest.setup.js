// Simple Jest setup without MongoDB Memory Server
// This configuration is more reliable for CI/CD environments

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret_for_testing';
process.env.PORT = '5001';

// Mock mongoose connection for testing
jest.mock('mongoose', () => {
    const mockMongoose = {
        connect: jest.fn().mockResolvedValue(true),
        disconnect: jest.fn().mockResolvedValue(true),
        connection: {
            close: jest.fn().mockResolvedValue(true),
            readyState: 1, // Connected
            collections: {}
        },
        Schema: jest.requireActual('mongoose').Schema,
        model: jest.requireActual('mongoose').model,
        Types: jest.requireActual('mongoose').Types
    };
    return mockMongoose;
});

// Global test setup
beforeAll(async () => {
    console.log('� Iniciando setup de tests (mocked)...');
    console.log('✅ Setup de test completado');
});

// Global teardown
afterAll(async () => {
    console.log('🧹 Limpieza de tests completada');
});

// Clean up between tests
beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
});

afterEach(() => {
    // Additional cleanup if needed
});
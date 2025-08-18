// jest.setup.js
process.env.NODE_ENV = 'test';

// Suppress console during tests
if (process.env.SUPPRESS_LOGS !== 'false') {
    global.console = {
        ...console,
        // Keep console.error and console.warn for debugging test failures
        log: jest.fn(),
        info: jest.fn(),
        debug: jest.fn(),
    };
}

// Setup environment variables for testing
process.env.JWT_SECRET = 'test_jwt_secret';
process.env.PORT = 5001; // Different port from development

// Global teardown to clean test resources
afterAll(async () => {
    // Any global cleanup needed
});

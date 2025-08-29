module.exports = {
    testEnvironment: 'node',
    verbose: true,
    roots: ['<rootDir>'],
    testTimeout: 30000,
    detectOpenHandles: true,
    forceExit: true,
    clearMocks: true,
    setupFilesAfterEnv: ['<rootDir>/__test__/setup.js'],
    testMatch: ['**/__test__/**/*.test.js'],
};

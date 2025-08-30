module.exports = {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testMatch: ['**/__test__/**/*.test.js'],
    collectCoverageFrom: [
        'models/**/*.js',
        'routers/**/*.js',
        'middleware/**/*.js',
        '!**/node_modules/**'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    verbose: true,
    forceExit: true,
    detectOpenHandles: true,
    testTimeout: 20000
};

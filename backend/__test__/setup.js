// Jest setup file for backend tests
// This file handles MongoDB Memory Server gracefully in CI environments

// Suppress console output during tests unless explicitly needed
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

beforeEach(() => {
    // Suppress known MongoDB Memory Server warnings and errors during tests
    console.warn = (message, ...args) => {
        if (typeof message === 'string' && (
            message.includes('MongoMemoryServer') ||
            message.includes('fastdl.mongodb.org') ||
            message.includes('Download failed')
        )) {
            return; // Suppress these warnings in CI
        }
        originalConsoleWarn(message, ...args);
    };
    
    console.error = (message, ...args) => {
        if (typeof message === 'string' && (
            message.includes('Could NOT download') ||
            message.includes('fastdl.mongodb.org') ||
            message.includes('getaddrinfo ENOTFOUND')
        )) {
            return; // Suppress these errors in CI
        }
        originalConsoleError(message, ...args);
    };
});

afterEach(() => {
    // Restore original console methods
    console.warn = originalConsoleWarn;
    console.error = originalConsoleError;
});

// Global test utilities
global.isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
global.canUseMongoDB = !global.isCI; // Assume MongoDB Memory Server won't work in CI
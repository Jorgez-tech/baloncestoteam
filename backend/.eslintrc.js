// .eslintrc.js para el backend
module.exports = {
    env: {
        es2021: true,
        node: true,
        jest: true,
    },
    extends: [
        'eslint:recommended',
        'prettier'
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
        'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        'no-process-exit': 'warn',
    },
};

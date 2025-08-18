// .eslintrc.js para el frontend
module.exports = {
    env: {
        browser: true,
        es2021: true,
        jest: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:testing-library/react',
        'prettier'
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: [
        'react',
        'react-hooks',
        'jsx-a11y',
        'testing-library',
    ],
    rules: {
        'react/react-in-jsx-scope': 'off', // No es necesario en React 17+
        'react/prop-types': 'warn', // Advertencia para props no validadas
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'no-console': ['warn', { allow: ['warn', 'error'] }], // Permite console.warn y console.error
        'jsx-a11y/alt-text': 'error', // Requerir texto alternativo en imágenes
    },
    settings: {
        react: {
            version: 'detect', // Detectar la versión automáticamente
        },
    },
};

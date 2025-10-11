import React from 'react';
import { render } from '@testing-library/react';
import { AuthProvider } from '../context/AuthContext';

const Providers = ({ children }) => React.createElement(AuthProvider, null, children);

export const customRender = (ui, options = {}) =>
    render(ui, { wrapper: Providers, ...options });

export const createAuthUser = (overrides = {}) => ({
    _id: '507f1f77bcf86cd799439011',
    email: 'user@example.com',
    role: 'user',
    isActive: true,
    ...overrides,
});

export const setAuthStorage = (user, token = 'test-token') => {
    if (user) {
        window.localStorage.setItem('user', JSON.stringify(user));
        window.localStorage.setItem('token', token);
    } else {
        window.localStorage.removeItem('user');
        window.localStorage.removeItem('token');
    }
};

export * from '@testing-library/react';

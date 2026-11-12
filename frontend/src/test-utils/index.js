import React from 'react';
import { render } from '@testing-library/react';
import { AuthProvider } from '../context/AuthContext';
import { authAPI } from '../api/client';

const Providers = ({ children }) => React.createElement(AuthProvider, null, children);

/**
 * Simula la hidratación de sesión. La sesión ya no se guarda en localStorage:
 * AuthProvider consulta GET /auth/profile, por lo que los tests declaran el
 * usuario esperado a través de este mock (cookies HttpOnly -> `user` o 401).
 */
export const mockAuthSession = (user) => {
    const implementation = () =>
        user
            ? Promise.resolve({ data: { success: true, user } })
            : Promise.reject({ response: { status: 401 } });

    if (jest.isMockFunction(authAPI.getProfile)) {
        authAPI.getProfile.mockImplementation(implementation);
    } else {
        jest.spyOn(authAPI, 'getProfile').mockImplementation(implementation);
    }

    return authAPI.getProfile;
};

export const customRender = (ui, { user = null, ...options } = {}) => {
    mockAuthSession(user);
    return render(ui, { wrapper: Providers, ...options });
};

export const createAuthUser = (overrides = {}) => ({
    _id: '507f1f77bcf86cd799439011',
    email: 'user@example.com',
    role: 'user',
    isActive: true,
    ...overrides,
});

export * from '@testing-library/react';

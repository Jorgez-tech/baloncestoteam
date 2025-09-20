import React from 'react';
import { customRender, screen } from './test-utils';
import Login from '../components/Login';

describe('Login page', () => {
    test('renders login form', () => {
        customRender(<Login />);
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
    });
});

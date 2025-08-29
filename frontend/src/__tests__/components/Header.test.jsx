// frontend/src/__tests__/components/Header.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../utils/test-utils';
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';

// Mock the useAuth hook
jest.mock('../../context/AuthContext');

describe('Header Component', () => {
    beforeEach(() => {
        // Reset mocks between tests
        useAuth.mockReset();
    });

    test('renders correctly when not authenticated', () => {
        // Mock auth context for not authenticated user
        useAuth.mockReturnValue({
            isAuthenticated: false,
            user: null,
            logout: jest.fn(),
        });

        render(<Header />);

        expect(screen.getByText('Equipo de Baloncesto')).toBeInTheDocument();
        expect(screen.getByText('Inicio')).toBeInTheDocument();
        expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
        expect(screen.getByText('Registrarse')).toBeInTheDocument();

        // Should not render logout or admin links
        expect(screen.queryByText('Cerrar Sesión')).not.toBeInTheDocument();
        expect(screen.queryByText('Admin')).not.toBeInTheDocument();
    });

    test('renders correctly when authenticated as regular user', () => {
        // Mock auth context for authenticated user
        useAuth.mockReturnValue({
            isAuthenticated: true,
            user: { username: 'testuser', role: 'user' },
            logout: jest.fn(),
        });

        render(<Header />);

        expect(screen.getByText('Equipo de Baloncesto')).toBeInTheDocument();
        expect(screen.getByText('Inicio')).toBeInTheDocument();
        expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument();
        expect(screen.getByText('Bienvenido, testuser')).toBeInTheDocument();

        // Should not render login/register or admin links
        expect(screen.queryByText('Iniciar Sesión')).not.toBeInTheDocument();
        expect(screen.queryByText('Registrarse')).not.toBeInTheDocument();
        expect(screen.queryByText('Admin')).not.toBeInTheDocument();
    });

    test('renders admin link when authenticated as admin', () => {
        // Mock auth context for admin user
        useAuth.mockReturnValue({
            isAuthenticated: true,
            user: { username: 'adminuser', role: 'admin' },
            logout: jest.fn(),
        });

        render(<Header />);

        expect(screen.getByText('Equipo de Baloncesto')).toBeInTheDocument();
        expect(screen.getByText('Admin')).toBeInTheDocument();
        expect(screen.getByText('Bienvenido, adminuser')).toBeInTheDocument();
    });

    test('calls logout when logout button is clicked', async () => {
        // Mock the logout function
        const mockLogout = jest.fn();

        useAuth.mockReturnValue({
            isAuthenticated: true,
            user: { username: 'testuser', role: 'user' },
            logout: mockLogout,
        });

        render(<Header />);

        const logoutButton = screen.getByText('Cerrar Sesión');
        fireEvent.click(logoutButton);

        // Check if logout was called
        await waitFor(() => {
            expect(mockLogout).toHaveBeenCalledTimes(1);
        });
    });
});

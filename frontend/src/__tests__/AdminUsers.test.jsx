import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminDashboard from '../pages/AdminDashboard';
import { playersAPI, usersAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

jest.mock('../api/client', () => {
    const mockPlayersAPI = {
        getAll: jest.fn(),
    };

    const mockUsersAPI = {
        getAll: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    return {
        playersAPI: mockPlayersAPI,
        usersAPI: mockUsersAPI,
        apiClient: {},
    };
});

jest.mock('../context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

const adminUser = {
    _id: 'admin-id',
    email: 'admin@test.com',
    role: 'admin',
};

const renderDashboard = () =>
    render(
        <MemoryRouter initialEntries={['/admin']}>
            <AdminDashboard />
        </MemoryRouter>
    );

describe('AdminDashboard - Usuarios', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useAuth.mockReturnValue({
            user: adminUser,
            isAdmin: true,
        });
        playersAPI.getAll.mockResolvedValue({ data: { data: [] } });
    });

    test('muestra mensaje de error y permite reintentar cuando falla la carga', async () => {
        usersAPI.getAll.mockRejectedValueOnce({
            response: { status: 403 },
        });

        renderDashboard();

        fireEvent.click(screen.getByRole('button', { name: /Usuarios/i }));

        expect(
            await screen.findByText(/Tu sesión no tiene permisos para gestionar usuarios/i)
        ).toBeInTheDocument();

        const sampleUsers = [
            {
                _id: 'user-1',
                email: 'user1@test.com',
                username: 'user1',
                role: 'user',
                isActive: true,
                createdAt: new Date().toISOString(),
            },
        ];

        usersAPI.getAll.mockResolvedValueOnce({ data: { data: sampleUsers } });

        fireEvent.click(screen.getByRole('button', { name: /Reintentar carga/i }));

        expect(await screen.findByText('user1@test.com')).toBeInTheDocument();
    });

    test('no muestra botón eliminar para el propio administrador', async () => {
        const usersPayload = {
            data: {
                data: [
                    {
                        _id: 'admin-id',
                        email: 'admin@test.com',
                        username: 'admin',
                        role: 'admin',
                        isActive: true,
                        createdAt: new Date().toISOString(),
                    },
                    {
                        _id: 'user-2',
                        email: 'player@test.com',
                        username: 'player',
                        role: 'user',
                        isActive: false,
                        createdAt: new Date().toISOString(),
                    },
                ],
            },
        };

        usersAPI.getAll.mockResolvedValueOnce(usersPayload);

        renderDashboard();

        fireEvent.click(screen.getByRole('button', { name: /Usuarios/i }));

        const adminCell = await screen.findByText('admin@test.com');
        const adminRow = adminCell.closest('tr');
        expect(adminRow).not.toBeNull();
        expect(adminRow.querySelector('button[title="Eliminar usuario"]')).toBeNull();

        const playerCell = await screen.findByText('player@test.com');
        const playerRow = playerCell.closest('tr');
        expect(playerRow.querySelector('button[title="Eliminar usuario"]')).toBeInTheDocument();
    });
});

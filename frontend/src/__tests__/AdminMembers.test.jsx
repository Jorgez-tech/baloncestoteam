import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminDashboard from '../pages/AdminDashboard';
import { playersAPI, usersAPI, membersAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

jest.mock('../api/client', () => ({
    playersAPI: { getAll: jest.fn() },
    usersAPI: { getAll: jest.fn(), update: jest.fn(), delete: jest.fn() },
    membersAPI: { getAll: jest.fn(), update: jest.fn() },
    apiClient: {},
}));

jest.mock('../context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
    },
}));

const membersPayload = {
    data: {
        data: [
            {
                _id: 'member-1',
                memberNumber: 'SOC-001',
                status: 'active',
                joinDate: '2026-01-15T00:00:00.000Z',
                userId: { email: 'socio@test.com' },
            },
            {
                _id: 'member-2',
                memberNumber: 'SOC-002',
                status: 'inactive',
                joinDate: '2026-02-20T00:00:00.000Z',
                userId: { email: 'baja@test.com' },
            },
        ],
    },
};

const renderDashboard = () =>
    render(
        <MemoryRouter initialEntries={['/admin']}>
            <AdminDashboard />
        </MemoryRouter>
    );

const openMembersTab = () =>
    fireEvent.click(screen.getByRole('button', { name: /Socios/i }));

describe('AdminDashboard - Socios', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useAuth.mockReturnValue({
            user: { _id: 'admin-id', email: 'admin@test.com', role: 'admin' },
            isAdmin: true,
        });
        playersAPI.getAll.mockResolvedValue({ data: { data: [] } });
        usersAPI.getAll.mockResolvedValue({ data: { data: [] } });
        membersAPI.getAll.mockResolvedValue(membersPayload);
    });

    test('lista los socios con su número y estado', async () => {
        renderDashboard();
        openMembersTab();

        expect(await screen.findByText('socio@test.com')).toBeInTheDocument();
        expect(screen.getByText('SOC-001')).toBeInTheDocument();
        expect(screen.getByText('baja@test.com')).toBeInTheDocument();
        expect(screen.getByText('SOC-002')).toBeInTheDocument();

        const activeRow = screen.getByText('SOC-001').closest('tr');
        expect(activeRow.querySelector('button[title="Desactivar socio"]')).toBeInTheDocument();

        const inactiveRow = screen.getByText('SOC-002').closest('tr');
        expect(inactiveRow.querySelector('button[title="Reactivar socio"]')).toBeInTheDocument();
    });

    test('muestra el mensaje del backend cuando la desactivación se bloquea por dependientes activos', async () => {
        const backendMessage =
            'No se puede desactivar al socio: mantiene 1 jugador(es) con inscripción activa en un equipo. Retire primero a los jugadores del roster.';
        const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
        membersAPI.update.mockRejectedValueOnce({
            response: { status: 409, data: { message: backendMessage } },
        });

        renderDashboard();
        openMembersTab();

        fireEvent.click(await screen.findByTitle('Desactivar socio'));

        await waitFor(() => {
            expect(membersAPI.update).toHaveBeenCalledWith('member-1', { status: 'inactive' });
        });
        expect(toast.error).toHaveBeenCalledWith(backendMessage);
        expect(toast.success).not.toHaveBeenCalled();

        confirmSpy.mockRestore();
    });

    test('no desactiva cuando el administrador cancela la confirmación', async () => {
        const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false);

        renderDashboard();
        openMembersTab();

        fireEvent.click(await screen.findByTitle('Desactivar socio'));

        expect(membersAPI.update).not.toHaveBeenCalled();
        confirmSpy.mockRestore();
    });
});

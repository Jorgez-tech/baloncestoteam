import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminDashboard from '../pages/AdminDashboard';
import { playersAPI, usersAPI, membersAPI, auditAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

jest.mock('../api/client', () => ({
    playersAPI: { getAll: jest.fn() },
    usersAPI: { getAll: jest.fn(), update: jest.fn(), delete: jest.fn() },
    membersAPI: { getAll: jest.fn(), update: jest.fn() },
    auditAPI: { getAll: jest.fn() },
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

const auditPayload = {
    data: {
        data: [
            {
                _id: 'log-1',
                timestamp: '2026-10-15T12:00:00.000Z',
                actorEmail: 'admin@test.com',
                action: 'MEMBER_UPDATED',
                targetEntity: 'Member',
                targetId: 'member-1',
                ip: '10.0.0.1',
            },
        ],
        meta: { total: 45, page: 1, limit: 20, totalPages: 3 },
    },
};

const renderDashboard = () =>
    render(
        <MemoryRouter initialEntries={['/admin']}>
            <AdminDashboard />
        </MemoryRouter>
    );

const openAuditTab = () =>
    fireEvent.click(screen.getByRole('button', { name: /Auditoría/i }));

describe('AdminDashboard - Auditoría', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useAuth.mockReturnValue({
            user: { _id: 'admin-id', email: 'admin@test.com', role: 'admin' },
            isAdmin: true,
        });
        playersAPI.getAll.mockResolvedValue({ data: { data: [] } });
        usersAPI.getAll.mockResolvedValue({ data: { data: [] } });
        membersAPI.getAll.mockResolvedValue({ data: { data: [] } });
        auditAPI.getAll.mockResolvedValue(auditPayload);
    });

    test('lista los registros de auditoría al abrir la pestaña', async () => {
        renderDashboard();
        openAuditTab();

        expect(await screen.findByRole('cell', { name: 'MEMBER_UPDATED' })).toBeInTheDocument();
        expect(screen.getByRole('cell', { name: 'admin@test.com' })).toBeInTheDocument();
        expect(screen.getByRole('cell', { name: 'Member' })).toBeInTheDocument();
        expect(screen.getByRole('cell', { name: '10.0.0.1' })).toBeInTheDocument();
        expect(auditAPI.getAll).toHaveBeenCalledWith({ page: 1, limit: 20 });
    });

    test('aplica el filtro por acción y reinicia a la primera página', async () => {
        renderDashboard();
        openAuditTab();

        await screen.findByText('MEMBER_UPDATED');

        fireEvent.change(screen.getByLabelText(/Acción/i), {
            target: { value: 'LOGIN_SUCCESS' },
        });

        await waitFor(() => {
            expect(auditAPI.getAll).toHaveBeenLastCalledWith({
                page: 1,
                limit: 20,
                action: 'LOGIN_SUCCESS',
            });
        });
    });

    test('navega a la página siguiente usando la paginación', async () => {
        renderDashboard();
        openAuditTab();

        await screen.findByText('MEMBER_UPDATED');

        const nextButton = screen.getByRole('button', { name: /Siguiente/i });
        expect(screen.getByText(/Página 1 de 3/i)).toBeInTheDocument();

        fireEvent.click(nextButton);

        await waitFor(() => {
            expect(auditAPI.getAll).toHaveBeenLastCalledWith({ page: 2, limit: 20 });
        });
    });

    test('muestra mensaje de permisos y permite reintentar cuando el backend responde 403', async () => {
        auditAPI.getAll.mockRejectedValueOnce({ response: { status: 403 } });

        renderDashboard();
        openAuditTab();

        expect(
            await screen.findByText(/Tu sesión no tiene permisos para consultar la auditoría/i)
        ).toBeInTheDocument();

        auditAPI.getAll.mockResolvedValueOnce(auditPayload);
        fireEvent.click(screen.getByRole('button', { name: /Reintentar carga/i }));

        expect(await screen.findByText('MEMBER_UPDATED')).toBeInTheDocument();
    });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AdminDashboard from '../pages/AdminDashboard';
import { AuthProvider } from '../context/AuthContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';

// Mock de APIs
jest.mock('../api/client', () => ({
    playersAPI: {
        getAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    usersAPI: {
        getAll: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    imagesAPI: {
        getAll: jest.fn(),
    }
}));

// Mock de react-toastify
jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
    },
    ToastContainer: () => null,
}));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
    },
});

function renderAdminDashboard(user = null) {
    const mockAuthContext = {
        user,
        loading: false,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login: jest.fn(),
        logout: jest.fn(),
        updateUser: jest.fn(),
    };

    return render(
        <QueryClientProvider client={queryClient}>
            <AuthProvider value={mockAuthContext}>
                <MemoryRouter initialEntries={['/admin']}>
                    <Routes>
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/login" element={<div>Login Page</div>} />
                    </Routes>
                    <ToastContainer />
                </MemoryRouter>
            </AuthProvider>
        </QueryClientProvider>
    );
}

describe('AdminDashboard Security Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock console.log para tests de auditoría
        jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('denies access to non-admin users', () => {
        const regularUser = {
            email: 'user@test.com',
            role: 'user',
            _id: '123'
        };

        renderAdminDashboard(regularUser);

        expect(screen.getByText('🚫 Acceso Denegado')).toBeInTheDocument();
        expect(screen.getByText(/Se requieren permisos de administrador/)).toBeInTheDocument();
        expect(screen.queryByText('Panel de Administración')).not.toBeInTheDocument();
    });

    test('denies access to unauthenticated users', () => {
        renderAdminDashboard(null);

        expect(screen.getByText('🚫 Acceso Denegado')).toBeInTheDocument();
        expect(screen.queryByText('Panel de Administración')).not.toBeInTheDocument();
    });

    test('allows access to admin users', async () => {
        const adminUser = {
            email: 'admin@test.com',
            role: 'admin',
            _id: '456'
        };

        // Mock API responses
        const { playersAPI, usersAPI } = require('../api/client');
        playersAPI.getAll.mockResolvedValue({ data: { data: [] } });
        usersAPI.getAll.mockResolvedValue({ data: { data: [] } });

        renderAdminDashboard(adminUser);

        await waitFor(() => {
            expect(screen.getByText('🛠️ Panel de Administración')).toBeInTheDocument();
        });

        expect(screen.getByText('Bienvenido, admin@test.com')).toBeInTheDocument();
        expect(screen.getByText('📊 Resumen')).toBeInTheDocument();
        expect(screen.getByText('🏀 Jugadores')).toBeInTheDocument();
        expect(screen.getByText('👥 Usuarios')).toBeInTheDocument();
        expect(screen.getByText('📋 Auditoría')).toBeInTheDocument();
    });

    test('logs admin access for audit trail', async () => {
        const adminUser = {
            email: 'admin@test.com',
            role: 'admin',
            _id: '456'
        };

        const { playersAPI, usersAPI } = require('../api/client');
        playersAPI.getAll.mockResolvedValue({ data: { data: [] } });
        usersAPI.getAll.mockResolvedValue({ data: { data: [] } });

        renderAdminDashboard(adminUser);

        await waitFor(() => {
            expect(console.log).toHaveBeenCalledWith(
                expect.stringContaining('[AUDIT] Admin access: admin@test.com')
            );
        });
    });

    test('validates player form input', async () => {
        const adminUser = {
            email: 'admin@test.com',
            role: 'admin',
            _id: '456'
        };

        const { playersAPI, usersAPI } = require('../api/client');
        playersAPI.getAll.mockResolvedValue({ data: { data: [] } });
        usersAPI.getAll.mockResolvedValue({ data: { data: [] } });

        renderAdminDashboard(adminUser);

        // Navegar a la pestaña de jugadores
        await waitFor(() => {
            fireEvent.click(screen.getByText('🏀 Jugadores'));
        });

        // Abrir modal de creación
        fireEvent.click(screen.getByText('➕ Agregar Jugador'));

        await waitFor(() => {
            expect(screen.getByText('Crear Jugador')).toBeInTheDocument();
        });

        // Intentar enviar formulario vacío
        const submitButton = screen.getByText('Crear');
        fireEvent.click(submitButton);

        // Verificar que se muestran errores de validación
        await waitFor(() => {
            const { toast } = require('react-toastify');
            expect(toast.error).toHaveBeenCalledWith(
                'Todos los campos obligatorios deben completarse'
            );
        });
    });

    test('prevents users from deleting themselves', async () => {
        const adminUser = {
            email: 'admin@test.com',
            role: 'admin',
            _id: '456'
        };

        const mockUsers = [
            { _id: '456', email: 'admin@test.com', role: 'admin', isActive: true, createdAt: new Date() },
            { _id: '789', email: 'user@test.com', role: 'user', isActive: true, createdAt: new Date() }
        ];

        const { playersAPI, usersAPI } = require('../api/client');
        playersAPI.getAll.mockResolvedValue({ data: { data: [] } });
        usersAPI.getAll.mockResolvedValue({ data: { data: mockUsers } });

        renderAdminDashboard(adminUser);

        // Navegar a la pestaña de usuarios
        await waitFor(() => {
            fireEvent.click(screen.getByText('👥 Usuarios'));
        });

        // Verificar que el admin no puede eliminar su propia cuenta
        const deleteButtons = screen.getAllByText('🗑️ Eliminar');
        expect(deleteButtons).toHaveLength(1); // Solo debe aparecer para el otro usuario
    });

    test('requires confirmation for destructive actions', async () => {
        const adminUser = {
            email: 'admin@test.com',
            role: 'admin',
            _id: '456'
        };

        const mockPlayers = [
            { _id: '1', name: 'Test Player', position: 'Base', number: 1, height: 180, weight: 75 }
        ];

        const { playersAPI, usersAPI } = require('../api/client');
        playersAPI.getAll.mockResolvedValue({ data: { data: mockPlayers } });
        usersAPI.getAll.mockResolvedValue({ data: { data: [] } });
        playersAPI.delete.mockResolvedValue({ data: { success: true } });

        // Mock window.confirm
        global.confirm = jest.fn(() => false);

        renderAdminDashboard(adminUser);

        // Navegar a la pestaña de jugadores
        await waitFor(() => {
            fireEvent.click(screen.getByText('🏀 Jugadores'));
        });

        await waitFor(() => {
            expect(screen.getByText('Test Player')).toBeInTheDocument();
        });

        // Intentar eliminar jugador
        fireEvent.click(screen.getByText('🗑️ Eliminar'));

        // Verificar que se pide confirmación
        expect(global.confirm).toHaveBeenCalledWith(
            '¿Estás seguro de eliminar al jugador Test Player?'
        );

        // Verificar que no se llama a la API si se cancela
        expect(playersAPI.delete).not.toHaveBeenCalled();
    });

    test('validates number uniqueness for players', async () => {
        const adminUser = {
            email: 'admin@test.com',
            role: 'admin',
            _id: '456'
        };

        const mockPlayers = [
            { _id: '1', name: 'Existing Player', position: 'Base', number: 23, height: 180, weight: 75 }
        ];

        const { playersAPI, usersAPI } = require('../api/client');
        playersAPI.getAll.mockResolvedValue({ data: { data: mockPlayers } });
        usersAPI.getAll.mockResolvedValue({ data: { data: [] } });

        renderAdminDashboard(adminUser);

        // Navegar a la pestaña de jugadores
        await waitFor(() => {
            fireEvent.click(screen.getByText('🏀 Jugadores'));
        });

        // Abrir modal de creación
        fireEvent.click(screen.getByText('➕ Agregar Jugador'));

        await waitFor(() => {
            expect(screen.getByText('Crear Jugador')).toBeInTheDocument();
        });

        // Llenar formulario con número duplicado
        fireEvent.change(screen.getByLabelText(/Nombre/), { target: { value: 'New Player' } });
        fireEvent.change(screen.getByLabelText(/Posición/), { target: { value: 'Escolta' } });
        fireEvent.change(screen.getByLabelText(/Número/), { target: { value: '23' } }); // Número duplicado
        fireEvent.change(screen.getByLabelText(/Altura/), { target: { value: '185' } });
        fireEvent.change(screen.getByLabelText(/Peso/), { target: { value: '80' } });

        // Intentar enviar
        fireEvent.click(screen.getByText('Crear'));

        // Verificar error de número duplicado
        await waitFor(() => {
            const { toast } = require('react-toastify');
            expect(toast.error).toHaveBeenCalledWith(
                'Ya existe un jugador con ese número'
            );
        });
    });
});

describe('AdminDashboard Functionality Tests', () => {
    test('switches between tabs correctly', async () => {
        const adminUser = {
            email: 'admin@test.com',
            role: 'admin',
            _id: '456'
        };

        const { playersAPI, usersAPI } = require('../api/client');
        playersAPI.getAll.mockResolvedValue({ data: { data: [] } });
        usersAPI.getAll.mockResolvedValue({ data: { data: [] } });

        renderAdminDashboard(adminUser);

        await waitFor(() => {
            expect(screen.getByText('📊 Estadísticas del Sistema')).toBeInTheDocument();
        });

        // Cambiar a pestaña de jugadores
        fireEvent.click(screen.getByText('🏀 Jugadores'));
        expect(screen.getByText('🏀 Gestión de Jugadores')).toBeInTheDocument();

        // Cambiar a pestaña de usuarios
        fireEvent.click(screen.getByText('👥 Usuarios'));
        expect(screen.getByText('👥 Gestión de Usuarios')).toBeInTheDocument();

        // Cambiar a pestaña de auditoría
        fireEvent.click(screen.getByText('📋 Auditoría'));
        expect(screen.getByText('📋 Registro de Auditoría')).toBeInTheDocument();
    });

    test('displays loading state correctly', async () => {
        const adminUser = {
            email: 'admin@test.com',
            role: 'admin',
            _id: '456'
        };

        const { playersAPI, usersAPI } = require('../api/client');
        // Simular respuesta lenta
        playersAPI.getAll.mockImplementation(() => new Promise(resolve => {
            setTimeout(() => resolve({ data: { data: [] } }), 100);
        }));
        usersAPI.getAll.mockResolvedValue({ data: { data: [] } });

        renderAdminDashboard(adminUser);

        // Verificar que se muestra el loading
        expect(screen.getByText('Cargando...')).toBeInTheDocument();

        // Esperar a que termine la carga
        await waitFor(() => {
            expect(screen.queryByText('Cargando...')).not.toBeInTheDocument();
        }, { timeout: 200 });
    });
});

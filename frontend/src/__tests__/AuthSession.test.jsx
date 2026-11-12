import '@testing-library/jest-dom/extend-expect';
import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { authAPI } from '../api/client';

jest.mock('../api/client', () => ({
    authAPI: {
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        getProfile: jest.fn(),
    },
    apiClient: {},
}));

const renderApp = (ui, { route = '/' } = {}) =>
    render(
        <AuthProvider>
            <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
        </AuthProvider>
    );

const LoginProbe = () => {
    const { login } = useAuth();
    const [result, setResult] = useState('idle');

    const handleClick = async () => {
        const outcome = await login({ email: 'user@test.com', password: 'secret' });
        setResult(outcome.success ? `ok:${outcome.user.email}` : `error:${outcome.error}`);
    };

    return (
        <>
            <button onClick={handleClick}>entrar</button>
            <span data-testid="login-result">{result}</span>
        </>
    );
};

describe('AuthContext - flujo de sesión (cookies HttpOnly)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('el login exitoso hidrata el usuario sin depender de un token en el JSON', async () => {
        authAPI.getProfile.mockRejectedValue({ response: { status: 401 } });
        authAPI.login.mockResolvedValue({
            data: { success: true, user: { _id: '1', email: 'user@test.com', role: 'user' } },
        });

        renderApp(<LoginProbe />);

        fireEvent.click(screen.getByRole('button', { name: 'entrar' }));

        expect(await screen.findByText('ok:user@test.com')).toBeInTheDocument();
    });

    test('el login fallido propaga el mensaje del backend', async () => {
        authAPI.getProfile.mockRejectedValue({ response: { status: 401 } });
        authAPI.login.mockRejectedValue({
            response: { status: 400, data: { success: false, message: 'Invalid credentials' } },
        });

        renderApp(<LoginProbe />);

        fireEvent.click(screen.getByRole('button', { name: 'entrar' }));

        expect(await screen.findByText('error:Invalid credentials')).toBeInTheDocument();
    });
});

describe('ProtectedRoute', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderProtected = () =>
        renderApp(
            <Routes>
                <Route path="/" element={<div>HOME PAGE</div>} />
                <Route path="/login" element={<div>LOGIN PAGE</div>} />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <div>ADMIN AREA</div>
                        </ProtectedRoute>
                    }
                />
            </Routes>,
            { route: '/admin' }
        );

    test('redirige a /login cuando no hay sesión activa', async () => {
        authAPI.getProfile.mockRejectedValue({ response: { status: 401 } });

        renderProtected();

        expect(await screen.findByText('LOGIN PAGE')).toBeInTheDocument();
    });

    test('renderiza el contenido para un administrador autenticado', async () => {
        authAPI.getProfile.mockResolvedValue({
            data: { success: true, user: { _id: '1', email: 'admin@test.com', role: 'admin' } },
        });

        renderProtected();

        expect(await screen.findByText('ADMIN AREA')).toBeInTheDocument();
    });

    test('redirige a home si el usuario autenticado no es admin', async () => {
        authAPI.getProfile.mockResolvedValue({
            data: { success: true, user: { _id: '1', email: 'user@test.com', role: 'user' } },
        });

        renderProtected();

        expect(await screen.findByText('HOME PAGE')).toBeInTheDocument();
    });
});

/* eslint-disable no-unused-vars */
import '@testing-library/jest-dom/extend-expect';
import { customRender, screen, createAuthUser } from '../test-utils';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AdminDashboard from '../pages/AdminDashboard';

function renderWithAuth(ui, { user = null, route = '/admin' } = {}) {
    if (user) {
        window.localStorage.setItem('user', JSON.stringify(user));
        window.localStorage.setItem('token', 'test-token');
    } else {
        window.localStorage.removeItem('user');
        window.localStorage.removeItem('token');
    }

    return customRender(
        <MemoryRouter initialEntries={[route]}>
            <Routes>
                <Route path="/admin" element={ui} />
                <Route path="/login" element={<div>Login Page</div>} />
            </Routes>
        </MemoryRouter>
    );
}

describe('Admin route protection', () => {
    let warnSpy;
    let infoSpy;

    beforeAll(() => {
        warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => { });
        infoSpy = jest.spyOn(console, 'info').mockImplementation(() => { });
    });

    afterEach(() => {
        window.localStorage.clear();
        warnSpy.mockClear();
        infoSpy.mockClear();
    });

    afterAll(() => {
        warnSpy.mockRestore();
        infoSpy.mockRestore();
    });

    test('muestra acceso denegado para usuarios sin rol admin', () => {
        renderWithAuth(<AdminDashboard />, { user: null });
        expect(screen.getByText(/Acceso Denegado/i)).toBeInTheDocument();
    });

    test('renderiza el dashboard para administradores', () => {
        const adminUser = createAuthUser({ role: 'admin', email: 'admin@test.com' });
        renderWithAuth(<AdminDashboard />, { user: adminUser });
        expect(screen.getByText(/Panel de Administración/i)).toBeInTheDocument();
    });
});

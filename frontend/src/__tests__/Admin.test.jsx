/* eslint-disable no-unused-vars */
import '@testing-library/jest-dom/extend-expect';
import { customRender, screen, createAuthUser } from '../test-utils';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AdminDashboard from '../pages/AdminDashboard';

function renderWithAuth(ui, { user = null, route = '/admin' } = {}) {
    return customRender(
        <MemoryRouter initialEntries={[route]}>
            <Routes>
                <Route path="/admin" element={ui} />
                <Route path="/login" element={<div>Login Page</div>} />
            </Routes>
        </MemoryRouter>,
        { user }
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
        warnSpy.mockClear();
        infoSpy.mockClear();
    });

    afterAll(() => {
        warnSpy.mockRestore();
        infoSpy.mockRestore();
    });

    test('muestra acceso denegado para usuarios sin rol admin', async () => {
        renderWithAuth(<AdminDashboard />, { user: null });
        expect(await screen.findByText(/Acceso Denegado/i)).toBeInTheDocument();
    });

    test('renderiza el dashboard para administradores', async () => {
        const adminUser = createAuthUser({ role: 'admin', email: 'admin@test.com' });
        renderWithAuth(<AdminDashboard />, { user: adminUser });
        expect(await screen.findByText(/Panel de Administración/i)).toBeInTheDocument();
    });
});

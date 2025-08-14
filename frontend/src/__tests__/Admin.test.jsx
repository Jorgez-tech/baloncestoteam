import React from 'react';
import { customRender, screen } from './test-utils';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AdminDashboard from '../components/AdminDashboard';
import { AuthProvider } from '../context/AuthContext';

function renderWithAuth(ui, { user = null, route = '/admin' } = {}) {
    window.localStorage.setItem('user', user ? JSON.stringify(user) : 'null');
    return customRender(
        <MemoryRouter initialEntries={[route]}>
            <Routes>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/login" element={<div>Login Page</div>} />
            </Routes>
        </MemoryRouter>
    );
}

describe('Admin route protection', () => {
    test('redirects to login if not authenticated', () => {
        renderWithAuth(<AdminDashboard />, { user: null });
        expect(screen.getByText(/login page/i)).toBeInTheDocument();
    });
    // Puedes agregar más tests para usuarios con rol admin
});

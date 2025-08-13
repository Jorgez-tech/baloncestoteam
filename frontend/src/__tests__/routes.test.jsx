
// Mock axios with interceptors for tests
jest.mock('axios', () => {
    return {
        create: () => ({
            interceptors: {
                request: { use: jest.fn() },
                response: { use: jest.fn() }
            }
        })
    };
});

import '@testing-library/jest-dom';

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import App from '../components/App';
import { AuthProvider } from '../context/AuthContext';

describe('Rutas públicas', () => {
    test('Home se muestra en /', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </MemoryRouter>
        );
        // Busca el link de navegación Inicio
        expect(screen.getByRole('link', { name: /inicio/i })).toBeInTheDocument();
    });

    test('Galería se muestra en /gallery', () => {
        render(
            <MemoryRouter initialEntries={['/gallery']}>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </MemoryRouter>
        );
        // Busca el título principal de la galería
        expect(screen.getByRole('heading', { name: /galería/i })).toBeInTheDocument();
    });

    test('Login se muestra en /login', () => {
        render(
            <MemoryRouter initialEntries={['/login']}>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </MemoryRouter>
        );
        // Busca el botón o link de Iniciar Sesión
        expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument();
    });

    test('404 para ruta inexistente', () => {
        render(
            <MemoryRouter initialEntries={['/noexiste']}>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </MemoryRouter>
        );
        // Busca el título principal de la página 404
        expect(screen.getByRole('heading', { name: /página no encontrada/i })).toBeInTheDocument();
    });
});

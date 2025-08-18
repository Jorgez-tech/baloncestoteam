// src/utils/test-utils.jsx
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import { AuthProvider } from '../context/AuthContext';

/**
 * Wrapper personalizado que proporciona todos los providers necesarios para testing
 * - AuthProvider: Contexto de autenticación
 * - QueryClientProvider: Para React Query
 * - BrowserRouter: Para React Router
 */
const AllTheProviders = ({ children }) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false, // Desactivamos retry en tests para evitar esperas
                cacheTime: 0  // Sin caché en tests
            },
        },
    });

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <BrowserRouter>
                    {children}
                </BrowserRouter>
            </AuthProvider>
        </QueryClientProvider>
    );
};

/**
 * Render personalizado que incluye todos los providers comunes
 * Usar en lugar del render de RTL para simplificar los tests
 */
const customRender = (ui, options) =>
    render(ui, { wrapper: AllTheProviders, ...options });

// Re-exportamos todo de RTL
export * from '@testing-library/react';

// Sobrescribimos el método render
export { customRender as render };

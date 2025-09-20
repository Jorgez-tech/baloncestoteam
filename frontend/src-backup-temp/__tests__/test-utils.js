import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from '../context/AuthContext';

const queryClient = new QueryClient();

export function customRender(ui, { route = '/', ...options } = {}) {
    window.history.pushState({}, 'Test page', route);
    return render(
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <BrowserRouter>{ui}</BrowserRouter>
            </AuthProvider>
        </QueryClientProvider>,
        options
    );
}

export * from '@testing-library/react';

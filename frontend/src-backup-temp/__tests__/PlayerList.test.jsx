import React from 'react';
import { customRender, screen } from './test-utils';
import PlayerList from '../components/PlayerList';

describe('PlayerList', () => {
    test('shows loading state', () => {
        // Simula loading
        customRender(<PlayerList loading={true} players={[]} />);
        expect(screen.getByText(/cargando/i)).toBeInTheDocument();
    });

    test('shows error state', () => {
        // Simula error
        customRender(<PlayerList error={{ message: 'Error de API' }} players={[]} />);
        expect(screen.getByText(/error de api/i)).toBeInTheDocument();
    });

    test('shows players list', () => {
        // Simula datos
        const players = [
            { _id: '1', name: 'Juan', position: 'Base', height: 180, weight: 75, stats: {} },
            { _id: '2', name: 'Miguel', position: 'Alero', height: 190, weight: 85, stats: {} }
        ];
        customRender(<PlayerList players={players} loading={false} error={null} />);
        expect(screen.getByText(/juan/i)).toBeInTheDocument();
        expect(screen.getByText(/miguel/i)).toBeInTheDocument();
    });
});

import { playersAPI } from './client';

// Función para obtener jugadores desde el backend
export async function fetchPlayers() {
    try {
        const response = await playersAPI.getAll();
        // La respuesta de axios viene en response.data
        // Si el backend devuelve { success, data }, extraemos data
        return response.data.data || response.data || [];
    } catch (error) {
        console.error('Error al obtener jugadores:', error);
        return [];
    }
}

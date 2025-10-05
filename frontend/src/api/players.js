// Función para obtener jugadores desde el backend
export async function fetchPlayers() {
    try {
        const response = await fetch('/api/v1/players');
        if (!response.ok) throw new Error('Error al obtener jugadores');
        const result = await response.json();
        // Si la respuesta tiene formato { success, data }, devolvemos solo data
        return result.data || [];
    } catch (error) {
        console.error(error);
        return [];
    }
}

const axios = require('axios');

const testBackendAPI = async () => {
    const baseURL = 'http://localhost:5000';

    try {
        console.log('🧪 Probando endpoints del backend...\n');

        // Test 1: Health check
        console.log('1. 🏥 Probando health check...');
        const healthResponse = await axios.get(`${baseURL}/health`);
        console.log(`✅ Health check: ${healthResponse.data.status}`);

        // Test 2: Players list
        console.log('\n2. 👥 Probando lista de jugadores...');
        const playersResponse = await axios.get(`${baseURL}/api/v1/players`);
        const players = playersResponse.data.data;
        console.log(`✅ Jugadores obtenidos: ${players.length}`);

        players.forEach((player, index) => {
            console.log(`   ${index + 1}. ${player.name} - ${player.position}`);
        });

        // Test 3: Individual player
        if (players.length > 0) {
            const firstPlayerId = players[0]._id;
            console.log(`\n3. 🎯 Probando jugador individual (${players[0].name})...`);
            const playerResponse = await axios.get(`${baseURL}/api/v1/players/${firstPlayerId}`);
            const playerData = playerResponse.data.data;

            console.log(`✅ Datos del jugador:`);
            console.log(`   Nombre: ${playerData.name}`);
            console.log(`   Posición: ${playerData.position}`);
            console.log(`   Estadísticas: ${playerData.stats.games_played} juegos`);
            console.log(`   Métricas: Eficiencia ${playerData.metrics?.efficiency || 'N/A'}`);
        }

        console.log('\n🎉 ¡Todos los tests pasaron exitosamente!');

    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.log('❌ El servidor no está corriendo en puerto 5000');
            console.log('💡 Ejecuta: npm start en el directorio backend');
        } else {
            console.error('❌ Error:', error.message);
        }
    }
};

testBackendAPI();

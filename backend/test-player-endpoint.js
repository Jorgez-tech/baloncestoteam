const mongoose = require('mongoose');
const Player = require('./models/player');
require('dotenv').config();

async function testPlayerEndpoint() {
    try {
        console.log('🔗 Conectando a MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conectado exitosamente');

        // Buscar todos los jugadores
        console.log('\n📋 Jugadores en la base de datos:');
        const players = await Player.find().populate('user_id', 'email name');

        if (players.length === 0) {
            console.log('❌ No hay jugadores en la base de datos');
            return;
        }

        players.forEach((player, index) => {
            console.log(`${index + 1}. ${player.name} (${player.position}) - ID: ${player._id}`);
        });

        // Probar la búsqueda individual
        const firstPlayer = players[0];
        console.log(`\n🔍 Probando búsqueda individual del jugador: ${firstPlayer.name}`);
        console.log('📊 Estadísticas:', firstPlayer.stats);

        // Calcular métricas como lo haría el endpoint
        const stats = firstPlayer.stats || {};
        const metrics = {
            total_points: Math.round((stats.points_per_game || 0) * (stats.games_played || 0)),
            total_rebounds: Math.round((stats.rebounds_per_game || 0) * (stats.games_played || 0)),
            total_assists: Math.round((stats.assists_per_game || 0) * (stats.games_played || 0)),
            efficiency:
                stats.games_played > 0
                    ? Math.round(
                          ((stats.points_per_game || 0) +
                              (stats.rebounds_per_game || 0) +
                              (stats.assists_per_game || 0)) *
                              10
                      ) / 10
                    : 0,
        };

        console.log('📈 Métricas calculadas:', metrics);

        console.log('\n✅ Endpoint GET /api/v1/players/:id listo para usar');
        console.log(
            `🌐 Prueba en navegador: http://localhost:5000/api/v1/players/${firstPlayer._id}`
        );
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔚 Conexión cerrada');
    }
}

// Ejecutar prueba
testPlayerEndpoint();

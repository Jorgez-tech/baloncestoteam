require('dotenv').config();
const mongoose = require('mongoose');
const Player = require('./models/player');

const testPlayersEndpoint = async () => {
    try {
        console.log('🔗 Conectando a MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conectado a MongoDB');

        // Probar obtener todos los jugadores
        console.log('\n📋 Probando obtener todos los jugadores...');
        const players = await Player.find().populate('user_id', 'email name');

        console.log(`✅ Encontrados ${players.length} jugadores:`);
        players.forEach((player, index) => {
            console.log(`${index + 1}. ${player.name} - ${player.position}`);
        });

        // Probar obtener un jugador específico
        if (players.length > 0) {
            const firstPlayer = players[0];
            console.log(`\n🎯 Probando obtener jugador específico: ${firstPlayer.name}`);

            const playerDetail = await Player.findById(firstPlayer._id).populate('user_id');

            // Calcular métricas como en el endpoint
            const stats = playerDetail.stats || {};
            const metrics = {
                total_points: Math.round((stats.points_per_game || 0) * (stats.games_played || 0)),
                total_rebounds: Math.round(
                    (stats.rebounds_per_game || 0) * (stats.games_played || 0)
                ),
                total_assists: Math.round(
                    (stats.assists_per_game || 0) * (stats.games_played || 0)
                ),
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

            console.log(`✅ Jugador: ${playerDetail.name}`);
            console.log(
                `📊 Estadísticas: ${stats.games_played} juegos, ${stats.points_per_game} PPG`
            );
            console.log('🎯 Métricas calculadas:', metrics);
        }

        await mongoose.connection.close();
        console.log('\n✅ Prueba completada exitosamente');
    } catch (error) {
        console.error('❌ Error en la prueba:', error.message);
        process.exit(1);
    }
};

testPlayersEndpoint();

const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
);
app.use(express.json());

// Datos de ejemplo para jugadores
const playersData = [
    {
        _id: '507f1f77bcf86cd799439011',
        name: 'Juan Pérez',
        position: 'Escolta',
        height: 185,
        weight: 80,
        jersey_number: 23,
        birthdate: '1995-05-15',
        photo: null,
        stats: {
            games_played: 20,
            points_per_game: 15.5,
            rebounds_per_game: 8.2,
            assists_per_game: 4.1,
        },
        user_id: {
            _id: '507f1f77bcf86cd799439012',
            email: 'juan@email.com',
            name: 'Juan',
            isActive: true,
            createdAt: '2024-01-15T10:30:00Z',
        },
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
    },
    {
        _id: '507f1f77bcf86cd799439013',
        name: 'María González',
        position: 'Base',
        height: 175,
        weight: 68,
        jersey_number: 10,
        birthdate: '1997-03-22',
        photo: null,
        stats: {
            games_played: 18,
            points_per_game: 12.3,
            rebounds_per_game: 5.8,
            assists_per_game: 7.2,
        },
        user_id: {
            _id: '507f1f77bcf86cd799439014',
            email: 'maria@email.com',
            name: 'María',
            isActive: true,
            createdAt: '2024-01-20T14:15:00Z',
        },
        createdAt: '2024-01-20T14:15:00Z',
        updatedAt: '2024-01-20T14:15:00Z',
    },
    {
        _id: '507f1f77bcf86cd799439015',
        name: 'Carlos Rodríguez',
        position: 'Alero',
        height: 195,
        weight: 90,
        jersey_number: 7,
        birthdate: '1993-08-10',
        photo: null,
        stats: {
            games_played: 22,
            points_per_game: 18.7,
            rebounds_per_game: 9.1,
            assists_per_game: 3.5,
        },
        user_id: {
            _id: '507f1f77bcf86cd799439016',
            email: 'carlos@email.com',
            name: 'Carlos',
            isActive: true,
            createdAt: '2024-01-10T09:45:00Z',
        },
        createdAt: '2024-01-10T09:45:00Z',
        updatedAt: '2024-01-10T09:45:00Z',
    },
];

// Rutas
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server funcionando correctamente' });
});

// GET todos los jugadores
app.get('/api/v1/players', (req, res) => {
    const { page = 1, limit = 20 } = req.query;

    res.json({
        success: true,
        data: playersData,
        meta: {
            total: playersData.length,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(playersData.length / limit),
        },
    });
});

// GET jugador por ID
app.get('/api/v1/players/:id', (req, res) => {
    const { id } = req.params;
    const player = playersData.find((p) => p._id === id);

    if (!player) {
        return res.status(404).json({
            success: false,
            message: 'Jugador no encontrado',
        });
    }

    // Calcular métricas
    const stats = player.stats || {};
    const playerData = {
        ...player,
        metrics: {
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
        },
    };

    res.json({
        success: true,
        data: playerData,
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor demo funcionando en puerto ${PORT}`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
    console.log(`👥 Jugadores: http://localhost:${PORT}/api/v1/players`);
    console.log('📱 Frontend: http://localhost:3000');
});

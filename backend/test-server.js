const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Test simple sin Redis
console.log('🚀 Iniciando servidor de prueba...');

// Conectar a la base de datos
connectDB();

// Middleware básico
app.use(express.json());

// Ruta de prueba
app.get('/api/test', (req, res) => {
    res.json({
        message: '✅ Servidor funcionando correctamente',
        timestamp: new Date().toISOString(),
        database: 'MongoDB conectado',
    });
});

// Ruta para verificar usuarios
app.get('/api/users', async (req, res) => {
    try {
        const User = require('./models/user');
        const users = await User.find({}).select('-password');
        res.json({
            count: users.length,
            users: users,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para verificar jugadores
app.get('/api/players', async (req, res) => {
    try {
        const Player = require('./models/player');
        const players = await Player.find({}).populate('user_id', 'email');
        res.json({
            count: players.length,
            players: players,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Servidor de prueba ejecutándose en puerto ${PORT}`);
    console.log(`🌐 Prueba: http://localhost:${PORT}/api/test`);
    console.log(`👥 Usuarios: http://localhost:${PORT}/api/users`);
    console.log(`🏀 Jugadores: http://localhost:${PORT}/api/players`);
});

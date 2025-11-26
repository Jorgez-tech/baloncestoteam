const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/user');
const Player = require('./models/player');

const sampleUsers = [
    {
        email: 'admin@basketballteam.com',
        password: 'admin123',
        role: 'admin',
    },
    {
        email: 'player1@basketballteam.com',
        password: 'player123',
        role: 'user',
    },
    {
        email: 'player2@basketballteam.com',
        password: 'player123',
        role: 'user',
    },
    {
        email: 'player3@basketballteam.com',
        password: 'player123',
        role: 'user',
    },
];

const samplePlayers = [
    {
        name: 'Juan Carlos Rodriguez',
        position: 'Point Guard',
        height: 185,
        weight: 78,
        stats: {
            games_played: 24,
            points_per_game: 18.5,
            rebounds_per_game: 4.2,
            assists_per_game: 8.7,
        },
    },
    {
        name: 'Miguel Angel Torres',
        position: 'Shooting Guard',
        height: 190,
        weight: 82,
        stats: {
            games_played: 22,
            points_per_game: 22.3,
            rebounds_per_game: 5.1,
            assists_per_game: 3.4,
        },
    },
    {
        name: 'Carlos Alberto Mendez',
        position: 'Center',
        height: 205,
        weight: 95,
        stats: {
            games_played: 23,
            points_per_game: 15.8,
            rebounds_per_game: 12.3,
            assists_per_game: 2.1,
        },
    },
];

const seedDatabase = async () => {
    try {
        console.log('Conectando a MongoDB...');
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conectado a MongoDB');

        // Limpiar colecciones existentes
        console.log('Limpiando colecciones existentes...');
        await User.deleteMany({});
        await Player.deleteMany({});
        console.log('Colecciones limpiadas');

        // Crear usuarios
        console.log('Creando usuarios...');
        const createdUsers = [];

        for (const userData of sampleUsers) {
            const user = new User(userData);
            await user.save();
            createdUsers.push(user);
            console.log(`Usuario creado: ${user.email}`);
        }

        // Crear jugadores (asociar con usuarios)
        console.log('Creando jugadores...');
        for (let i = 0; i < samplePlayers.length; i++) {
            const playerData = {
                ...samplePlayers[i],
                user_id: createdUsers[i + 1]._id, // Saltar el admin (index 0)
            };

            const player = new Player(playerData);
            await player.save();
            console.log(`Jugador creado: ${playerData.name} - ${playerData.position}`);
        }

        console.log('\nBase de datos poblada exitosamente!');
        console.log('\nResumen:');
        console.log(`Usuarios creados: ${await User.countDocuments()}`);
        console.log(`Jugadores creados: ${await Player.countDocuments()}`);

        console.log('\nCredenciales de prueba:');
        console.log('Admin: admin@basketballteam.com / admin123');
        console.log('Player1: player1@basketballteam.com / player123');
        console.log('Player2: player2@basketballteam.com / player123');
        console.log('Player3: player3@basketballteam.com / player123');

        await mongoose.connection.close();
        console.log('\nConexión cerrada');
        process.exit(0);
    } catch (error) {
        console.error('Error al poblar la base de datos:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
};

// Función para verificar conexión
const testConnection = async () => {
    try {
        console.log('Probando conexión a MongoDB...');
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Conexión exitosa a MongoDB');
        console.log(`Base de datos: ${mongoose.connection.name}`);
        console.log(`Host: ${mongoose.connection.host}`);
        console.log(`Puerto: ${mongoose.connection.port}`);

        // Verificar colecciones
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\nColecciones encontradas:');
        collections.forEach((col) => {
            console.log(`  - ${col.name}`);
        });

        // Contar documentos
        const userCount = await User.countDocuments();
        const playerCount = await Player.countDocuments();

        console.log('\nDocumentos en la base de datos:');
        console.log(`Usuarios: ${userCount}`);
        console.log(`Jugadores: ${playerCount}`);

        await mongoose.connection.close();
        console.log('\nPrueba de conexión completada');
    } catch (error) {
        console.error('Error de conexión:', error.message);
        process.exit(1);
    }
};

// Ejecutar según el argumento de línea de comandos
const action = process.argv[2];

if (action === 'seed') {
    console.log('Iniciando población de la base de datos...\n');
    seedDatabase();
} else if (action === 'test') {
    console.log('Iniciando prueba de conexión...\n');
    testConnection();
} else {
    console.log(`
Basketball Team - Utilidad de Base de Datos

Uso: node seed-db.js [comando]

Comandos disponibles:
  test    - Probar conexión y mostrar información de la DB
  seed    - Poblar la base de datos con datos de prueba

Ejemplos:
  node seed-db.js test
  node seed-db.js seed
  `);
}

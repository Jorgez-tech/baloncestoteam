const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

// Global setup - runs once before all tests
beforeAll(async () => {
    console.log('🧪 Iniciando setup de tests...');

    // Crear MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create({
        instance: {
            port: 27018, // Puerto específico para tests
            dbName: 'basketball_test'
        }
    });

    const uri = mongoServer.getUri();
    console.log(`📦 MongoDB Memory Server URI: ${uri}`);

    // Conectar a la base de datos de test
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    console.log('✅ Conexión a MongoDB de test establecida');
});

// Global teardown - runs once after all tests
afterAll(async () => {
    console.log('🧹 Iniciando limpieza de tests...');

    try {
        // Cerrar conexión de Mongoose
        await mongoose.connection.close();
        console.log('✅ Conexión de Mongoose cerrada');

        // Detener MongoDB Memory Server
        if (mongoServer) {
            await mongoServer.stop();
            console.log('✅ MongoDB Memory Server detenido');
        }

        // Forzar desconexión de Mongoose
        await mongoose.disconnect();
        console.log('✅ Mongoose desconectado completamente');

    } catch (error) {
        console.error('❌ Error durante limpieza:', error);
    }

    console.log('🏁 Limpieza de tests completada');
});

// Limpiar base de datos entre tests
beforeEach(async () => {
    // Limpiar todas las colecciones antes de cada test
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});
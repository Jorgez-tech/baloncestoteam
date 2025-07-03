const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const app = express();

// Conectar a la base de datos
connectDB();

// Conectar a Redis (opcional)
try {
    connectRedis();
    console.log('🔄 Intentando conexión a Redis...');
} catch (error) {
    console.warn('⚠️  Redis no disponible, continuando sin cache:', error.message);
}

// Configurar CORS
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middleware de seguridad
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // límite de 100 requests por IP por ventana de tiempo
    message: {
        error: 'Too many requests from this IP, please try again later.'
    }
});
app.use('/api/', limiter);

// Middleware de parseo
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Servir archivos estáticos
app.use('/uploads', express.static('uploads'));

// Swagger/OpenAPI Documentation
const swaggerDocument = YAML.load(__dirname + '/docs/openapi.yaml');
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API Routes
app.use('/api/v1/auth', require('./routers/auth'));
app.use('/api/v1/users', require('./routers/users'));
app.use('/api/v1/players', require('./routers/players'));
app.use('/api/v1/images', require('./routers/images'));
app.use('/api/v1/profiles', require('./routers/profiles'));

// 404 handler para rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        msg: 'Route not found',
        path: req.originalUrl
    });
});

// Error handler global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        msg: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api/v1/docs`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
});
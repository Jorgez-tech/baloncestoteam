const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
// Cargar .env siempre desde la carpeta backend (independiente del cwd)
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

// Configurar trust proxy para express-rate-limit
app.set('trust proxy', 1);

// Conectar a la base de datos
if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

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
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Middleware de seguridad
app.use(
    helmet({
        contentSecurityPolicy: false, // Desactiva CSP si no lo necesitas
        xssFilter: false, // Desactiva X-XSS-Protection (obsoleto)
    })
);

// Forzar header X-Content-Type-Options y charset utf-8
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    // Si la respuesta es HTML, fuerza charset utf-8
    const send = res.send;
    res.send = function (body) {
        if (typeof body === 'string' && body.trim().startsWith('<!DOCTYPE html')) {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
        }
        return send.call(this, body);
    };
    next();
});

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // límite de 100 requests por IP por ventana de tiempo
    message: {
        error: 'Too many requests from this IP, please try again later.',
    },
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
        uptime: process.uptime(),
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
        path: req.originalUrl,
    });
});

// Error handler global
app.use((err, req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({
        msg: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api/v1/docs`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
});

module.exports = app;

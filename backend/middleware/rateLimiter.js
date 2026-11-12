const rateLimit = require('express-rate-limit');

// Límite estricto para endpoints sensibles de autenticación (ADR-005 / A-06).
// Se aplica por IP y de forma independiente al limitador global de `server.js`.
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10, // 10 intentos por IP por ventana
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Demasiados intentos. Vuelve a intentarlo en unos minutos.',
    },
});

module.exports = { authLimiter };

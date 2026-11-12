const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const authController = require('../src/modules/auth/controllers/auth.controller');
const {
    registerDto,
    loginDto,
    forgotPasswordDto,
    verifyResetCodeDto,
    resetPasswordDto
} = require('../src/modules/auth/dtos/auth.dto');

// Rutas Públicas (Auth)
router.post('/register', authLimiter, registerDto, authController.register);
router.post('/login', authLimiter, loginDto, authController.login);
router.post('/refresh', authController.refresh);

// Flujo de Recuperación de Contraseña (3 pasos)
router.post('/forgot-password', authLimiter, forgotPasswordDto, authController.forgotPassword);
router.post('/verify-reset-code', authLimiter, verifyResetCodeDto, authController.verifyResetCode);
router.post('/reset-password', authLimiter, resetPasswordDto, authController.resetPassword);

// Rutas Protegidas
router.get('/profile', authMiddleware, authController.getProfile);
router.post('/logout', authController.logout); // Puede o no llevar authMiddleware si usa refresh token cookie

module.exports = router;

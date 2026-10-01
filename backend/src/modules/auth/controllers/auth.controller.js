const authService = require('../services/auth.service');
const auditService = require('../../audit/services/audit.service');

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
};

class AuthController {
    async register(req, res) {
        try {
            await authService.register(req.body);
            auditService.logAction({
                actorEmail: req.body.email,
                action: 'USER_CREATED',
                targetEntity: 'Auth',
                ip: req.ip,
                userAgent: req.headers['user-agent']
            });
            res.status(201).json({ success: true, message: 'Usuario registrado exitosamente' });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const { accessToken, refreshToken, user } = await authService.login(email, password);

            res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 }); // 15 min
            res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 días

            auditService.logAction({
                actorId: user._id.toString(),
                actorEmail: user.email,
                action: 'LOGIN_SUCCESS',
                targetEntity: 'Auth',
                targetId: user._id.toString(),
                ip: req.ip,
                userAgent: req.headers['user-agent']
            });

            res.json({ success: true, user });
        } catch (error) {
            auditService.logAction({
                actorEmail: req.body.email,
                action: 'LOGIN_FAILED',
                targetEntity: 'Auth',
                ip: req.ip,
                userAgent: req.headers['user-agent']
            });
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async refresh(req, res) {
        try {
            const { refreshToken: oldToken } = req.cookies;
            if (!oldToken) return res.status(401).json({ success: false, message: 'No refresh token' });

            const { accessToken, refreshToken, user } = await authService.refreshTokens(oldToken);

            res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
            res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

            res.json({ success: true, user });
        } catch (error) {
            res.status(401).json({ success: false, message: 'Sesión expirada o inválida' });
        }
    }

    async logout(req, res) {
        try {
            const { refreshToken } = req.cookies;
            await authService.logout(refreshToken);

            res.clearCookie('accessToken', cookieOptions);
            res.clearCookie('refreshToken', cookieOptions);

            if (req.user) {
                auditService.logAction({
                    actorId: req.user.id,
                    actorEmail: req.user.email,
                    action: 'LOGOUT',
                    targetEntity: 'Auth',
                    ip: req.ip,
                    userAgent: req.headers['user-agent']
                });
            }

            res.json({ success: true, message: 'Sesión cerrada exitosamente' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error cerrando sesión' });
        }
    }

    async getProfile(req, res) {
        // Asume middleware de auth ya inyectó req.user pero queremos devolver datos completos
        // El frontend solo usará esto en page reload si tiene el access token
        try {
            // Reutilizamos el endpoint genérico o respondemos con el req.user extendido
            const User = require('../../../../models/user.model');
            const user = await User.findById(req.user.id).select('-password');
            if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
            res.json({ success: true, user });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error' });
        }
    }

    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            await authService.forgotPassword(email, req.ip);

            auditService.logAction({
                actorEmail: email,
                action: 'PASSWORD_RESET_REQUESTED',
                targetEntity: 'Auth',
                ip: req.ip,
                userAgent: req.headers['user-agent']
            });

            res.json({ success: true, message: 'Si el correo existe, enviaremos un código de recuperación' });
        } catch (error) {
            res.status(400).json({ success: false, message: 'Error procesando solicitud' });
        }
    }

    async verifyResetCode(req, res) {
        try {
            const { email, code } = req.body;
            const sessionToken = await authService.verifyResetCode(email, code);

            auditService.logAction({
                actorEmail: email,
                action: 'PASSWORD_RESET_VERIFIED',
                targetEntity: 'Auth',
                ip: req.ip,
                userAgent: req.headers['user-agent']
            });

            res.json({ success: true, sessionToken });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async resetPassword(req, res) {
        try {
            const { resetSessionToken, newPassword } = req.body;
            const user = await authService.resetPassword(resetSessionToken, newPassword);

            // Invalidar cookies previas
            res.clearCookie('accessToken', cookieOptions);
            res.clearCookie('refreshToken', cookieOptions);

            auditService.logAction({
                actorId: user._id.toString(),
                actorEmail: user.email,
                action: 'PASSWORD_RESET_COMPLETED',
                targetEntity: 'Auth',
                ip: req.ip,
                userAgent: req.headers['user-agent']
            });

            res.json({ success: true, message: 'Contraseña actualizada exitosamente' });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = new AuthController();

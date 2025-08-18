const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authMiddleware = require('../middleware/auth');
const { validateUser, validateLogin, validateUserUpdate } = require('../middleware/validation');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const router = express.Router();

// Utilidad para obtener el JWT_SECRET y lanzar error si falta
function getJwtSecret() {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET no definido en variables de entorno');
    }
    return process.env.JWT_SECRET;
}

router.post('/register', validateUser, async (req, res) => {
    const { email, password, username, firstName, lastName } = req.body;
    try {
        const existing = await User.findOne({
            $or: [{ email }, { username }]
        });
        if (existing) {
            return res.status(400).json({
                success: false,
                msg: existing.email === email ? 'Email ya registrado' : 'Nombre de usuario ya registrado'
            });
        }

        const user = new User({
            email,
            password,
            username,
            firstName,
            lastName
        });
        await user.save();

        res.status(201).json({
            success: true,
            msg: 'Usuario registrado exitosamente'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'Error en el registro',
            error: error.message
        });
    }
});

router.post('/login', validateLogin, async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                msg: 'Credenciales inválidas'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                msg: 'Credenciales inválidas'
            });
        }

        const token = jwt.sign({ id: user._id }, getJwtSecret(), {
            expiresIn: process.env.JWT_EXPIRE || '1h'
        });

        res.json({
            success: true,
            user: user.toJSON(),
            token,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'Error en el login',
            error: error.message
        });
    }
});

// GET /auth/profile - Devuelve el usuario autenticado
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json({ user: user.toJSON() });
    } catch (error) {
        res.status(500).json({ msg: 'Error fetching profile', error: error.message });
    }
});

// POST /auth/logout - Idempotente
router.post('/logout', authMiddleware, async (req, res) => {
    // Si usas blacklist de tokens, aqu� podr�as invalidar el token
    // Por ahora, solo responde OK
    res.json({ msg: 'Logout successful' });
});

module.exports = router;
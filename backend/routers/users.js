const express = require('express');
const User = require('../models/user');
const authMiddleware = require('../middleware/auth');
const mongoose = require('mongoose');

const router = express.Router();

// GET /api/v1/users - Listar todos los usuarios (solo admin)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const requester = req.user;

        if (!requester || requester.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado. Se requieren permisos de administrador.'
            });
        }

        const users = await User.find()
            .select('-password') // No enviar contraseñas
            .sort({ createdAt: -1 }); // Más recientes primero

        res.json({
            success: true,
            data: users,
            meta: {
                total: users.length
            }
        });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener usuarios',
            error: error.message
        });
    }
});

// GET /api/v1/users/:id - Obtener usuario específico (solo admin)
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const requester = req.user;

        if (!requester) {
            return res.status(401).json({
                success: false,
                message: 'No se pudo validar la sesión del usuario.'
            });
        }

        if (requester.role !== 'admin' && requester.id?.toString() !== req.params.id) {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado.'
            });
        }

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID de usuario inválido'
            });
        }

        const user = await User.findById(id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching user:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener usuario',
            error: error.message
        });
    }
});

// PUT /api/v1/users/:id - Actualizar usuario (solo admin)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const requester = req.user;

        if (!requester || requester.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado. Se requieren permisos de administrador.'
            });
        }

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID de usuario inválido'
            });
        }

        // Evitar que se modifique la contraseña desde este endpoint
        const { password, ...updateData } = req.body;

        if (password) {
            return res.status(400).json({
                success: false,
                message: 'No se puede cambiar la contraseña desde este endpoint'
            });
        }

        const user = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Log de auditoría
        // eslint-disable-next-line no-console
        console.log(`[AUDIT] User ${requester.email} updated user ${user.email}`);

        res.json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            data: user
        });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error updating user:', error);
        res.status(400).json({
            success: false,
            message: 'Error al actualizar usuario',
            error: error.message
        });
    }
});

// DELETE /api/v1/users/:id - Eliminar usuario (solo admin)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const requester = req.user;

        if (!requester || requester.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado. Se requieren permisos de administrador.'
            });
        }

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID de usuario inválido'
            });
        }

        // Evitar que el admin se elimine a sí mismo
        if (requester.id?.toString() === id) {
            return res.status(400).json({
                success: false,
                message: 'No puedes eliminar tu propia cuenta'
            });
        }

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Log de auditoría
        // eslint-disable-next-line no-console
        console.log(`[AUDIT] User ${requester.email} deleted user ${user.email}`);

        res.json({
            success: true,
            message: 'Usuario eliminado exitosamente'
        });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar usuario',
            error: error.message
        });
    }
});

// PATCH /api/v1/users/:id/toggle-active - Activar/Desactivar usuario (solo admin)
router.patch('/:id/toggle-active', authMiddleware, async (req, res) => {
    try {
        const requester = req.user;

        if (!requester || requester.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado. Se requieren permisos de administrador.'
            });
        }

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID de usuario inválido'
            });
        }

        // Evitar que el admin se desactive a sí mismo
        if (requester.id?.toString() === id) {
            return res.status(400).json({
                success: false,
                message: 'No puedes cambiar tu propio estado'
            });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        user.isActive = !user.isActive;
        await user.save();

        // Log de auditoría
        // eslint-disable-next-line no-console
        console.log(`[AUDIT] User ${requester.email} ${user.isActive ? 'activated' : 'deactivated'} user ${user.email}`);

        res.json({
            success: true,
            message: `Usuario ${user.isActive ? 'activado' : 'desactivado'} exitosamente`,
            data: {
                _id: user._id,
                email: user.email,
                isActive: user.isActive
            }
        });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error toggling user status:', error);
        res.status(500).json({
            success: false,
            message: 'Error al cambiar estado del usuario',
            error: error.message
        });
    }
});

module.exports = router;

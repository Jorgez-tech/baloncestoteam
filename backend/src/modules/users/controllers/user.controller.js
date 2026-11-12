const userService = require('../services/user.service');
const auditService = require('../../audit/services/audit.service');

class UserController {
    async listUsers(req, res) {
        try {
            const requester = req.user;
            if (!requester || requester.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Acceso denegado. Se requieren permisos de administrador.',
                });
            }

            const users = await userService.listUsers();
            res.json({
                success: true,
                data: users,
                meta: {
                    total: users.length,
                },
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener usuarios',
                error: error.message,
            });
        }
    }

    async getUser(req, res) {
        try {
            const requester = req.user;
            const { id } = req.params;

            if (requester.role !== 'admin' && requester.id?.toString() !== id) {
                return res.status(403).json({
                    success: false,
                    message: 'Acceso denegado.',
                });
            }

            const user = await userService.getUserById(id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado',
                });
            }

            res.json({
                success: true,
                data: user,
            });
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener usuario',
                error: error.message,
            });
        }
    }

    async updateUser(req, res) {
        try {
            const requester = req.user;
            if (!requester || requester.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Acceso denegado. Se requieren permisos de administrador.',
                });
            }
            const { id } = req.params;
            const updateData = req.body;

            const user = await userService.updateUser(id, updateData);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado',
                });
            }

            auditService.logAction({
                actorId: requester.id,
                actorEmail: requester.email,
                action: 'USER_UPDATED',
                targetEntity: 'User',
                targetId: user._id.toString(),
                ip: req.ip,
                userAgent: req.headers['user-agent']
            });

            res.json({
                success: true,
                message: 'Usuario actualizado exitosamente',
                data: user,
            });
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(400).json({
                success: false,
                message: 'Error al actualizar usuario',
                error: error.message,
            });
        }
    }

    async deleteUser(req, res) {
        try {
            const requester = req.user;
            if (!requester || requester.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Acceso denegado. Se requieren permisos de administrador.',
                });
            }
            const { id } = req.params;

            if (requester.id?.toString() === id) {
                return res.status(400).json({
                    success: false,
                    message: 'No puedes eliminar tu propia cuenta',
                });
            }

            const user = await userService.deleteUser(id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado',
                });
            }

            auditService.logAction({
                actorId: requester.id,
                actorEmail: requester.email,
                action: 'USER_SOFT_DELETED',
                targetEntity: 'User',
                targetId: user._id.toString(),
                ip: req.ip,
                userAgent: req.headers['user-agent']
            });

            res.json({
                success: true,
                message: 'Usuario desactivado exitosamente',
            });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({
                success: false,
                message: 'Error al eliminar usuario',
                error: error.message,
            });
        }
    }

    async toggleUserStatus(req, res) {
        try {
            const requester = req.user;
            if (!requester || requester.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Acceso denegado. Se requieren permisos de administrador.',
                });
            }
            const { id } = req.params;

            if (requester.id?.toString() === id) {
                return res.status(400).json({
                    success: false,
                    message: 'No puedes cambiar tu propio estado',
                });
            }

            const user = await userService.toggleUserStatus(id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado',
                });
            }

            auditService.logAction({
                actorId: requester.id,
                actorEmail: requester.email,
                action: 'USER_STATUS_TOGGLED',
                targetEntity: 'User',
                targetId: user._id.toString(),
                metadata: { isActive: user.isActive },
                ip: req.ip,
                userAgent: req.headers['user-agent']
            });

            res.json({
                success: true,
                message: `Usuario ${user.isActive ? 'activado' : 'desactivado'} exitosamente`,
                data: {
                    _id: user._id,
                    email: user.email,
                    isActive: user.isActive,
                },
            });
        } catch (error) {
            console.error('Error toggling user status:', error);
            res.status(500).json({
                success: false,
                message: 'Error al cambiar estado del usuario',
                error: error.message,
            });
        }
    }
}

module.exports = new UserController();

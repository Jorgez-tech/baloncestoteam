const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const userController = require('../src/modules/users/controllers/user.controller');
const { updateUserDto, listUsersDto, validateObjectIdParam, withValidation } = require('../src/modules/users/dtos/user.dto');

// Validar parámetros genéricos
const validateId = withValidation([validateObjectIdParam('id')]);

// GET /api/v1/users - Listar usuarios (solo admin, con filtros/paginación opcionales)
router.get('/', authMiddleware, listUsersDto, userController.listUsers);

// GET /api/v1/users/:id - Obtener usuario específico
router.get('/:id', authMiddleware, validateId, userController.getUser);

// PUT /api/v1/users/:id - Actualizar usuario
router.put('/:id', authMiddleware, updateUserDto, userController.updateUser);

// DELETE /api/v1/users/:id - Eliminar usuario
router.delete('/:id', authMiddleware, validateId, userController.deleteUser);

// PATCH /api/v1/users/:id/toggle-active - Activar/Desactivar usuario
router.patch('/:id/toggle-active', authMiddleware, validateId, userController.toggleUserStatus);

module.exports = router;

const { body, validationResult } = require('express-validator');

/**
 * Middleware para manejar errores de validación
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

/**
 * Validación para crear/editar jugadores
 */
const validatePlayer = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name can only contain letters and spaces'),

    body('position')
        .isIn(['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'])
        .withMessage('Invalid position'),

    body('height')
        .isInt({ min: 150, max: 250 })
        .withMessage('Height must be between 150 and 250 cm'),

    body('weight')
        .isInt({ min: 50, max: 150 })
        .withMessage('Weight must be between 50 and 150 kg'),

    body('user_id')
        .isMongoId()
        .withMessage('Invalid user ID'),

    handleValidationErrors
];

/**
 * Validación para actualizar jugadores (campos opcionales)
 */
const validatePlayerUpdate = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name can only contain letters and spaces'),

    body('position')
        .optional()
        .isIn(['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'])
        .withMessage('Invalid position'),

    body('height')
        .optional()
        .isInt({ min: 150, max: 250 })
        .withMessage('Height must be between 150 and 250 cm'),

    body('weight')
        .optional()
        .isInt({ min: 50, max: 150 })
        .withMessage('Weight must be between 50 and 150 kg'),

    body('user_id')
        .optional()
        .isMongoId()
        .withMessage('Invalid user ID'),

    handleValidationErrors
];

/**
 * Validación para usuarios
 */
const validateUser = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Invalid email format'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

    body('role')
        .optional()
        .isIn(['user', 'admin'])
        .withMessage('Role must be either user or admin'),

    handleValidationErrors
];

module.exports = {
    validatePlayer,
    validatePlayerUpdate,
    validateUser,
    handleValidationErrors
};

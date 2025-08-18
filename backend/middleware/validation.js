const { body, validationResult } = require('express-validator');

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors: errors.array()
        });
    }
    next();
};

// Validaciones para usuarios
const validateUser = [
    body('username')
        .isLength({ min: 3, max: 30 })
        .withMessage('El nombre de usuario debe tener entre 3 y 30 caracteres')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('El nombre de usuario solo puede contener letras, números y guiones bajos'),

    body('email')
        .isEmail()
        .withMessage('El email debe tener un formato válido')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('La contraseña debe contener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 carácter especial'),

    body('firstName')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('El nombre debe tener entre 2 y 50 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .withMessage('El nombre solo puede contener letras y espacios'),

    body('lastName')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('El apellido debe tener entre 2 y 50 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .withMessage('El apellido solo puede contener letras y espacios'),

    handleValidationErrors
];

// Validaciones para jugadores
const validatePlayer = [
    body('name')
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre debe tener entre 2 y 100 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .withMessage('El nombre solo puede contener letras y espacios'),

    body('position')
        .isIn(['Base', 'Escolta', 'Alero', 'Ala-Pívot', 'Pívot'])
        .withMessage('La posición debe ser válida: Base, Escolta, Alero, Ala-Pívot, Pívot'),

    body('number')
        .isInt({ min: 1, max: 99 })
        .withMessage('El número debe ser un entero entre 1 y 99'),

    body('height')
        .optional()
        .isFloat({ min: 1.50, max: 2.50 })
        .withMessage('La altura debe estar entre 1.50 y 2.50 metros'),

    body('weight')
        .optional()
        .isFloat({ min: 50, max: 200 })
        .withMessage('El peso debe estar entre 50 y 200 kg'),

    body('age')
        .optional()
        .isInt({ min: 16, max: 50 })
        .withMessage('La edad debe estar entre 16 y 50 años'),

    body('team')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('El equipo debe tener entre 2 y 50 caracteres'),

    handleValidationErrors
];

// Validaciones para login
const validateLogin = [
    body('email')
        .isEmail()
        .withMessage('El email debe tener un formato válido')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('La contraseña es requerida'),

    handleValidationErrors
];

// Validaciones para fotos
const validatePhoto = [
    body('title')
        .optional()
        .isLength({ max: 200 })
        .withMessage('El título no puede exceder 200 caracteres'),

    body('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('La descripción no puede exceder 1000 caracteres'),

    body('category')
        .optional()
        .isIn(['game', 'training', 'event', 'team', 'other'])
        .withMessage('La categoría debe ser válida: game, training, event, team, other'),

    handleValidationErrors
];

// Validaciones para actualización de usuario
const validateUserUpdate = [
    body('username')
        .optional()
        .isLength({ min: 3, max: 30 })
        .withMessage('El nombre de usuario debe tener entre 3 y 30 caracteres')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('El nombre de usuario solo puede contener letras, números y guiones bajos'),

    body('email')
        .optional()
        .isEmail()
        .withMessage('El email debe tener un formato válido')
        .normalizeEmail(),

    body('firstName')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('El nombre debe tener entre 2 y 50 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .withMessage('El nombre solo puede contener letras y espacios'),

    body('lastName')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('El apellido debe tener entre 2 y 50 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .withMessage('El apellido solo puede contener letras y espacios'),

    handleValidationErrors
];

// Validaciones para actualización de jugador
const validatePlayerUpdate = [
    body('name')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre debe tener entre 2 y 100 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .withMessage('El nombre solo puede contener letras y espacios'),

    body('position')
        .optional()
        .isIn(['Base', 'Escolta', 'Alero', 'Ala-Pívot', 'Pívot'])
        .withMessage('La posición debe ser válida: Base, Escolta, Alero, Ala-Pívot, Pívot'),

    body('number')
        .optional()
        .isInt({ min: 1, max: 99 })
        .withMessage('El número debe ser un entero entre 1 y 99'),

    body('height')
        .optional()
        .isFloat({ min: 1.50, max: 2.50 })
        .withMessage('La altura debe estar entre 1.50 y 2.50 metros'),

    body('weight')
        .optional()
        .isFloat({ min: 50, max: 200 })
        .withMessage('El peso debe estar entre 50 y 200 kg'),

    body('age')
        .optional()
        .isInt({ min: 16, max: 50 })
        .withMessage('La edad debe estar entre 16 y 50 años'),

    body('team')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('El equipo debe tener entre 2 y 50 caracteres'),

    handleValidationErrors
];

module.exports = {
    validateUser,
    validatePlayer,
    validateLogin,
    validatePhoto,
    validateUserUpdate,
    validatePlayerUpdate,
    handleValidationErrors
};

const { body } = require('express-validator');
const { withValidation } = require('../../users/dtos/user.dto');

const allowedPositions = ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'];

// Self-service update of the authenticated user's own account.
const updateProfileDto = withValidation([
    body('name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('El nombre no puede estar vacío'),
    body('email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Debe ser un email válido')
        .normalizeEmail(),
]);

// Player self-service update. Whitelists only the fields the owner may change so
// ownership (user_id), status (isActive) and computed metrics (stats) can never
// be mass-assigned through this endpoint.
const updatePlayerProfileDto = withValidation([
    body('name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('El nombre no puede estar vacío'),
    body('position')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('La posición no puede estar vacía')
        .bail()
        .isIn(allowedPositions)
        .withMessage(`La posición debe ser una de: ${allowedPositions.join(', ')}`),
    body('height')
        .optional()
        .isFloat({ min: 150, max: 230 })
        .withMessage('La altura debe estar entre 150 y 230 cm')
        .toFloat(),
    body('weight')
        .optional()
        .isFloat({ min: 50, max: 150 })
        .withMessage('El peso debe estar entre 50 y 150 kg')
        .toFloat(),
    body('jersey_number')
        .optional()
        .isInt({ min: 1, max: 99 })
        .withMessage('El número de camiseta debe estar entre 1 y 99')
        .toInt(),
    body('age')
        .optional({ nullable: true })
        .isInt({ min: 16, max: 50 })
        .withMessage('La edad debe estar entre 16 y 50 años')
        .toInt(),
    body('avatar').optional().isString().trim(),
    body('bio').optional().isString().trim(),
]);

module.exports = {
    updateProfileDto,
    updatePlayerProfileDto,
};

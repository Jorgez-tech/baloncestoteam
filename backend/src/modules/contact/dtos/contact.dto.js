const { body } = require('express-validator');
const { withValidation } = require('../../users/dtos/user.dto');

const createContactDto = withValidation([
    body('nombre')
        .trim()
        .notEmpty()
        .withMessage('El nombre es obligatorio'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Por favor, incluye un correo electrónico válido')
        .normalizeEmail(),
    body('telefono')
        .optional({ nullable: true })
        .trim(),
    body('mensaje')
        .trim()
        .notEmpty()
        .withMessage('El mensaje es obligatorio'),
]);

module.exports = {
    createContactDto,
};

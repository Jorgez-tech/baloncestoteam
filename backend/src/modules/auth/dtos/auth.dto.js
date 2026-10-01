const { body } = require('express-validator');
const { withValidation } = require('../../players/dtos/player.dto');

const registerDto = withValidation([
    body('email').trim().isEmail().withMessage('Debe ser un email válido').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('name').optional().trim().isString()
]);

const loginDto = withValidation([
    body('email').trim().notEmpty().withMessage('El email es obligatorio').isEmail().normalizeEmail(),
    body('password').notEmpty().withMessage('La contraseña es obligatoria')
]);

const forgotPasswordDto = withValidation([
    body('email').trim().notEmpty().withMessage('El email es obligatorio').isEmail().normalizeEmail()
]);

const verifyResetCodeDto = withValidation([
    body('email').trim().notEmpty().isEmail().normalizeEmail(),
    body('code').trim().isLength({ min: 6, max: 6 }).withMessage('El código debe tener 6 dígitos').isNumeric()
]);

const resetPasswordDto = withValidation([
    body('resetSessionToken').trim().notEmpty().withMessage('El token de sesión es obligatorio'),
    body('newPassword').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
]);

module.exports = {
    registerDto,
    loginDto,
    forgotPasswordDto,
    verifyResetCodeDto,
    resetPasswordDto
};

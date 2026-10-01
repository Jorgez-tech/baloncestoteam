const { body, param, validationResult, matchedData } = require('express-validator');
const mongoose = require('mongoose');

const withValidation = (validations) => async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Error de validación',
            errors: errors.array(),
        });
    }

    // Whitelisting: filter req.body to only contain validated fields
    req.body = matchedData(req, { locations: ['body'] });
    return next();
};

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const validateObjectIdParam = (field = 'id') =>
    param(field)
        .custom(isObjectId)
        .withMessage(`El parámetro ${field} debe ser un ObjectId válido`);

const updateUserDto = withValidation([
    validateObjectIdParam(),
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
    body('role')
        .optional()
        .trim()
        .isIn(['user', 'admin'])
        .withMessage('El rol debe ser user o admin'),
    body('isActive')
        .optional()
        .isBoolean()
        .toBoolean(),
]);

module.exports = {
    updateUserDto,
    validateObjectIdParam,
    withValidation,
};

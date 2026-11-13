const { body, param, query, validationResult, matchedData } = require('express-validator');
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

const withQueryValidation = (validations) => async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Error de validación',
            errors: errors.array(),
        });
    }

    // Whitelisting: solo los query params validados llegan a la capa de servicio.
    req.validatedQuery = matchedData(req, { locations: ['query'] });
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

const listUsersDto = withQueryValidation([
    query('page').optional().isInt({ min: 1 }).withMessage('page debe ser un entero mayor o igual a 1').toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit debe estar entre 1 y 100').toInt(),
    query('role').optional().trim().isIn(['user', 'admin']).withMessage('El rol debe ser user o admin'),
    query('isActive').optional().isBoolean().withMessage('isActive debe ser booleano').toBoolean(),
    query('search').optional().trim().notEmpty().withMessage('search no puede estar vacío'),
]);

module.exports = {
    updateUserDto,
    listUsersDto,
    validateObjectIdParam,
    withValidation,
    withQueryValidation,
};

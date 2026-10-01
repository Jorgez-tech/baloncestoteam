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

const allowedPositions = ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'];

const createPlayerDto = withValidation([
    body('user_id')
        .notEmpty()
        .withMessage('El campo user_id es obligatorio')
        .bail()
        .custom(isObjectId)
        .withMessage('El user_id debe ser un ObjectId válido'),
    body('name').trim().notEmpty().withMessage('El nombre es obligatorio'),
    body('position')
        .trim()
        .notEmpty()
        .withMessage('La posición es obligatoria')
        .bail()
        .isIn(allowedPositions)
        .withMessage(`La posición debe ser una de: ${allowedPositions.join(', ')}`),
    body('height')
        .notEmpty()
        .withMessage('La altura es obligatoria')
        .bail()
        .isFloat({ min: 150, max: 230 })
        .withMessage('La altura debe estar entre 150 y 230 cm')
        .toFloat(),
    body('weight')
        .notEmpty()
        .withMessage('El peso es obligatorio')
        .bail()
        .isFloat({ min: 50, max: 150 }) // Spec says 50-150kg
        .withMessage('El peso debe estar entre 50 y 150 kg')
        .toFloat(),
    body('jersey_number')
        .optional()
        .isInt({ min: 0, max: 99 })
        .withMessage('El número de camiseta debe estar entre 0 y 99')
        .toInt(),
    body('age')
        .optional({ nullable: true })
        .isInt({ min: 16, max: 50 })
        .withMessage('La edad debe estar entre 16 y 50 años')
        .toInt(),
    body('avatar').optional().isString().trim(),
    body('bio').optional().isString().trim(),
]);

const updatePlayerDto = withValidation([
    validateObjectIdParam(),
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
        .isInt({ min: 0, max: 99 })
        .withMessage('El número de camiseta debe estar entre 0 y 99')
        .toInt(),
    body('age')
        .optional({ nullable: true })
        .isInt({ min: 16, max: 50 })
        .withMessage('La edad debe estar entre 16 y 50 años')
        .toInt(),
    body('avatar').optional().isString().trim(),
    body('bio').optional().isString().trim(),
    body('isActive').optional().isBoolean().toBoolean(),
]);

module.exports = {
    createPlayerDto,
    updatePlayerDto,
    validateObjectIdParam,
    withValidation, // Exported to be reused if needed
};

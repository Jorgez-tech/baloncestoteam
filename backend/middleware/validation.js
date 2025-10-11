const { body, validationResult, param } = require('express-validator');
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

    return next();
};

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const validateObjectIdParam = (field = 'id') =>
    param(field)
        .custom(isObjectId)
        .withMessage(`El parámetro ${field} debe ser un ObjectId válido`);

const validatePlayer = withValidation([
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
        .isString()
        .withMessage('La posición debe ser un texto'),
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
        .isFloat({ min: 50, max: 200 })
        .withMessage('El peso debe estar entre 50 y 200 kg')
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
]);

const validatePlayerUpdate = withValidation([
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
        .withMessage('La posición no puede estar vacía'),
    body('height')
        .optional()
        .isFloat({ min: 150, max: 230 })
        .withMessage('La altura debe estar entre 150 y 230 cm')
        .toFloat(),
    body('weight')
        .optional()
        .isFloat({ min: 50, max: 200 })
        .withMessage('El peso debe estar entre 50 y 200 kg')
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
]);

module.exports = {
    validatePlayer,
    validatePlayerUpdate,
    validateObjectIdParam,
};

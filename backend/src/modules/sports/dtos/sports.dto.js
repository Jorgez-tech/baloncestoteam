const { body, param } = require('express-validator');
const { withValidation, validateObjectIdParam } = require('../../users/dtos/user.dto'); // Reusing utilities

// === CLUB DTOs ===
const createClubDto = withValidation([
    body('name').trim().notEmpty().withMessage('El nombre es obligatorio'),
    body('logo').optional().isString(),
    body('contactEmail').optional().isEmail().normalizeEmail(),
    body('address').optional().isString()
]);

const updateClubDto = withValidation([
    validateObjectIdParam(),
    body('name').optional().trim().notEmpty(),
    body('logo').optional().isString(),
    body('contactEmail').optional().isEmail().normalizeEmail(),
    body('address').optional().isString(),
    body('isActive').optional().isBoolean().toBoolean()
]);

// === CATEGORY DTOs ===
const createCategoryDto = withValidation([
    body('name').trim().notEmpty().withMessage('El nombre es obligatorio'),
    body('gender').isIn(['M', 'F', 'Mixed']).withMessage('El género debe ser M, F o Mixed'),
    body('minAge').optional().isInt({ min: 0 }),
    body('maxAge').optional().isInt({ min: 0 }),
    body('clubId').notEmpty().isMongoId().withMessage('clubId inválido')
]);

const updateCategoryDto = withValidation([
    validateObjectIdParam(),
    body('name').optional().trim().notEmpty(),
    body('gender').optional().isIn(['M', 'F', 'Mixed']),
    body('minAge').optional().isInt({ min: 0 }),
    body('maxAge').optional().isInt({ min: 0 }),
    body('isActive').optional().isBoolean().toBoolean()
]);

// === TEAM DTOs ===
const createTeamDto = withValidation([
    body('name').trim().notEmpty().withMessage('El nombre es obligatorio'),
    body('categoryId').notEmpty().isMongoId().withMessage('categoryId es obligatorio y debe ser válido'),
    body('season').trim().notEmpty().withMessage('La temporada es obligatoria'),
    body('headCoachId').optional().isMongoId()
]);

const updateTeamDto = withValidation([
    validateObjectIdParam(),
    body('name').optional().trim().notEmpty(),
    body('categoryId').optional().isMongoId(),
    body('season').optional().trim().notEmpty(),
    body('headCoachId').optional().isMongoId(),
    body('isActive').optional().isBoolean().toBoolean()
]);

module.exports = {
    createClubDto, updateClubDto,
    createCategoryDto, updateCategoryDto,
    createTeamDto, updateTeamDto,
    validateObjectIdParam: (field) => withValidation([validateObjectIdParam(field)])
};

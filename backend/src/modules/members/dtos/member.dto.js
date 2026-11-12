const { body, query } = require('express-validator');
const { withValidation, validateObjectIdParam, withQueryValidation } = require('../../users/dtos/user.dto');

const createMemberDto = withValidation([
    body('userId').notEmpty().isMongoId().withMessage('userId debe ser un MongoId válido'),
    body('memberNumber').trim().notEmpty().withMessage('memberNumber es obligatorio'),
    body('status').optional().isIn(['active', 'inactive', 'delinquent']).withMessage('Estado no válido')
]);

const updateMemberDto = withValidation([
    validateObjectIdParam('id'),
    body('memberNumber').optional().trim().notEmpty(),
    body('status').optional().isIn(['active', 'inactive', 'delinquent'])
]);

const linkDependentDto = withValidation([
    validateObjectIdParam('memberId'),
    body('playerId').notEmpty().isMongoId().withMessage('playerId debe ser un MongoId válido'),
    body('relationship').optional().isIn(['parent', 'legal_guardian', 'grandparent', 'other']),
    body('isFinancialResponsible').optional().isBoolean().toBoolean()
]);

const listMembersDto = withQueryValidation([
    query('page').optional().isInt({ min: 1 }).withMessage('page debe ser un entero mayor o igual a 1').toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit debe estar entre 1 y 100').toInt(),
    query('status').optional().isIn(['active', 'inactive', 'delinquent']).withMessage('Estado no válido'),
    query('userId').optional().isMongoId().withMessage('userId debe ser un MongoId válido'),
    query('memberNumber').optional().trim().notEmpty().withMessage('memberNumber no puede estar vacío'),
]);

module.exports = {
    createMemberDto,
    updateMemberDto,
    linkDependentDto,
    listMembersDto,
    validateObjectIdParam: (field) => withValidation([validateObjectIdParam(field)])
};

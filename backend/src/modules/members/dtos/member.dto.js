const { body } = require('express-validator');
const { withValidation, validateObjectIdParam } = require('../../users/dtos/user.dto');

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

module.exports = {
    createMemberDto,
    updateMemberDto,
    linkDependentDto,
    validateObjectIdParam: (field) => withValidation([validateObjectIdParam(field)])
};

const { body, query } = require('express-validator');
const { withValidation, validateObjectIdParam, withQueryValidation } = require('../../users/dtos/user.dto');

const createObligationDto = withValidation([
    body('memberId').notEmpty().isMongoId().withMessage('memberId inválido'),
    body('title').trim().notEmpty().withMessage('title es obligatorio'),
    body('type').isIn(['mensualidad', 'matricula', 'uniforme', 'otro']).withMessage('Tipo inválido'),
    body('amount').isFloat({ min: 0 }).withMessage('El monto debe ser un número positivo'),
    body('dueDate').isISO8601().toDate().withMessage('dueDate debe ser una fecha válida'),
    body('period').optional().isString().trim()
]);

const updateObligationStatusDto = withValidation([
    validateObjectIdParam('id'),
    body('status').isIn(['pending', 'paid', 'overdue', 'cancelled']).withMessage('Estado inválido'),
    body('paymentMethod').optional().isString(),
    body('transactionId').optional().isString()
]);

const generateBatchDto = withValidation([
    body('title').trim().notEmpty().withMessage('title es obligatorio'),
    body('type').equals('mensualidad').withMessage('Solo se pueden generar lotes de mensualidades'),
    body('period').trim().notEmpty().withMessage('El periodo es obligatorio para generación masiva (ej. 2026-04)'),
    body('amount').isFloat({ min: 0 }).withMessage('El monto debe ser un número positivo'),
    body('dueDate').isISO8601().toDate().withMessage('dueDate debe ser una fecha válida')
]);

const listMemberObligationsDto = withQueryValidation([
    query('page').optional().isInt({ min: 1 }).withMessage('page debe ser un entero mayor o igual a 1').toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit debe estar entre 1 y 100').toInt(),
    query('status').optional().trim().isIn(['pending', 'paid', 'overdue', 'cancelled']).withMessage('Estado inválido'),
    query('type').optional().trim().isIn(['mensualidad', 'matricula', 'uniforme', 'otro']).withMessage('Tipo inválido'),
    query('period').optional().trim().notEmpty().withMessage('period no puede estar vacío'),
]);

module.exports = {
    createObligationDto,
    updateObligationStatusDto,
    generateBatchDto,
    listMemberObligationsDto,
    validateObjectIdParam: (field) => withValidation([validateObjectIdParam(field)])
};

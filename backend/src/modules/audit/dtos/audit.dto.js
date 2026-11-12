const { query } = require('express-validator');
const mongoose = require('mongoose');
const { withQueryValidation } = require('../../users/dtos/user.dto');

const listAuditLogsDto = withQueryValidation([
    query('page').optional().isInt({ min: 1 }).withMessage('page debe ser un entero mayor o igual a 1').toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit debe estar entre 1 y 100').toInt(),
    query('action').optional().trim().notEmpty().withMessage('action no puede estar vacío'),
    query('targetEntity').optional().trim().notEmpty().withMessage('targetEntity no puede estar vacío'),
    query('actorId')
        .optional()
        .trim()
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage('actorId debe ser un ObjectId válido'),
    query('from').optional().isISO8601().withMessage('from debe ser una fecha ISO 8601').toDate(),
    query('to').optional().isISO8601().withMessage('to debe ser una fecha ISO 8601').toDate(),
]);

module.exports = {
    listAuditLogsDto,
};

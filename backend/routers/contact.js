const express = require('express');
const { contactLimiter } = require('../middleware/rateLimiter');
const { createContactDto } = require('../src/modules/contact/dtos/contact.dto');
const contactController = require('../src/modules/contact/controllers/contact.controller');

const router = express.Router();

// POST /api/v1/contact - Recibir un mensaje del formulario de contacto (SPEC §3: rate-limited)
router.post('/', contactLimiter, createContactDto, contactController.submitMessage);

module.exports = router;

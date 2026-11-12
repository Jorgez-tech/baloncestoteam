const express = require('express');
const { createContactDto } = require('../src/modules/contact/dtos/contact.dto');
const contactController = require('../src/modules/contact/controllers/contact.controller');

const router = express.Router();

// POST /api/v1/contact - Recibir un mensaje del formulario de contacto
router.post('/', createContactDto, contactController.submitMessage);

module.exports = router;

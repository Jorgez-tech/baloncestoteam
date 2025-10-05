const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// @route   POST /api/v1/contact
// @desc    Recibir y procesar un mensaje de contacto
// @access  Public
router.post(
    '/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Por favor, incluye un correo electrónico válido').isEmail(),
        check('mensaje', 'El mensaje es obligatorio').not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { nombre, email, telefono, mensaje } = req.body;

        try {
            // Aquí puedes integrar la lógica para enviar un correo electrónico,
            // guardar en la base de datos o notificar a un servicio externo.
            // Por ahora, solo simularemos una respuesta exitosa.

            console.log('Nuevo mensaje de contacto recibido:');
            console.log(`- Nombre: ${nombre}`);
            console.log(`- Email: ${email}`);
            console.log(`- Teléfono: ${telefono || 'No proporcionado'}`);
            console.log(`- Mensaje: ${mensaje}`);

            res.status(200).json({ msg: 'Mensaje recibido correctamente. Gracias por contactarnos.' });

        } catch (err) {
            console.error('Error al procesar el mensaje de contacto:', err.message);
            res.status(500).send('Error del servidor');
        }
    }
);

module.exports = router;

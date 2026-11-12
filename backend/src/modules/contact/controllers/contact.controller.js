const contactService = require('../services/contact.service');

class ContactController {
    async submitMessage(req, res) {
        try {
            await contactService.submitMessage(req.body);
            res.status(200).json({
                success: true,
                msg: 'Mensaje recibido correctamente. Gracias por contactarnos.',
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                msg: 'Error al enviar el mensaje. Intenta nuevamente.',
                error: error.message,
            });
        }
    }
}

module.exports = new ContactController();

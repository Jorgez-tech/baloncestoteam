const imageService = require('../services/image.service');

class ImageController {
    uploadImage(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
            }

            res.json({
                message: 'Imagen subida exitosamente',
                filename: req.file.filename,
                path: req.file.path,
                size: req.file.size,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    getImage(req, res) {
        try {
            if (!imageService.imageExists(req.params.filename)) {
                return res.status(404).json({ error: 'Imagen no encontrada' });
            }

            res.sendFile(imageService.resolveImagePath(req.params.filename));
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ImageController();

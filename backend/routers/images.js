const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const { validatePhoto } = require('../middleware/validation');

const router = express.Router();

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.UPLOAD_PATH || './uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880 // 5MB por defecto
    },
    fileFilter: function (req, file, cb) {
        // Validar tipo de archivo
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de imagen (JPEG, PNG, GIF, WebP)'));
        }
    }
});

// POST /api/v1/images/upload
router.post('/upload', auth, upload.single('image'), validatePhoto, (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No se proporcionó ningún archivo'
            });
        }

        // Datos adicionales de la imagen (title, description, category)
        const imageData = {
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: req.file.path,
            size: req.file.size,
            mimetype: req.file.mimetype,
            uploadedBy: req.user.id,
            title: req.body.title || req.file.originalname,
            description: req.body.description || '',
            category: req.body.category || 'other',
            uploadDate: new Date()
        };

        res.json({
            success: true,
            message: 'Imagen subida exitosamente',
            data: imageData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET /api/v1/images/:filename
router.get('/:filename', (req, res) => {
    try {
        const path = require('path');
        const fs = require('fs');
        const imagePath = path.join(process.env.UPLOAD_PATH || './uploads/', req.params.filename);

        if (fs.existsSync(imagePath)) {
            res.sendFile(path.resolve(imagePath));
        } else {
            res.status(404).json({ error: 'Imagen no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
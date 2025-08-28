const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');

const router = express.Router();

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.UPLOAD_PATH || './uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB por defecto
    },
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de imagen'));
        }
    },
});

// POST /api/v1/images/upload
router.post('/upload', auth, upload.single('image'), (req, res) => {
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

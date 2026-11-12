const multer = require('multer');
const path = require('path');
const fs = require('fs');

const resolveUploadDir = () => process.env.UPLOAD_PATH || './uploads/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, resolveUploadDir());
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const extension = file.originalname.split('.').pop();
        cb(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
    },
});

class ImageService {
    constructor() {
        this.upload = multer({
            storage,
            limits: {
                fileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 5242880, // 5MB por defecto
            },
            fileFilter: (req, file, cb) => {
                if (file.mimetype.startsWith('image/')) {
                    return cb(null, true);
                }
                return cb(new Error('Solo se permiten archivos de imagen'));
            },
        });
    }

    single(fieldName) {
        return this.upload.single(fieldName);
    }

    resolveImagePath(filename) {
        return path.resolve(path.join(resolveUploadDir(), filename));
    }

    imageExists(filename) {
        return fs.existsSync(this.resolveImagePath(filename));
    }
}

module.exports = new ImageService();

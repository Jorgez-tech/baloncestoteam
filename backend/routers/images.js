const express = require('express');
const auth = require('../middleware/auth');
const imageService = require('../src/modules/images/services/image.service');
const imageController = require('../src/modules/images/controllers/image.controller');

const router = express.Router();

// POST /api/v1/images/upload
router.post('/upload', auth, imageService.single('image'), imageController.uploadImage);

// GET /api/v1/images/:filename
router.get('/:filename', imageController.getImage);

module.exports = router;

const express = require('express');
const router = express.Router();
const productController = require('./product.controller');
const upload = require('../../middleware/upload');

// POST /api/v1/products/analyze - upload multiple images for a product
router.post('/analyze', upload.array('images', 10), productController.analyze);

// PATCH /api/v1/products/:productId/review - submit human review/edits
router.patch('/:productId/review', express.json(), productController.review);

// GET /api/v1/products/taxonomy - get supported taxonomy
router.get('/taxonomy', productController.getTaxonomy);

module.exports = router;

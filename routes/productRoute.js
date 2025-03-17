const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET routes
router.get('/product/:id', productController.getProductById);
router.get('/products', productController.getAllProducts);

// POST routes
router.post('/product', productController.createProduct);

// PUT routes
router.put('/product/:id', productController.updateProduct);

// DELETE routes
router.delete('/product/:id', productController.deleteProduct);

module.exports = router;
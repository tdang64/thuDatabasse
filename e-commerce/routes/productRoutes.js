const express = require('express');
const productController = require('../controllers/productController');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Admin routes (only authenticated admins can access)
router.post('/', authMiddleware, isAdmin, productController.createProduct);
router.put('/:id', authMiddleware, isAdmin, productController.updateProduct);
router.delete('/:id', authMiddleware, isAdmin, productController.deleteProduct);

module.exports = router;

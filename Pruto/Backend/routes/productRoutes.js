// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
// const authenticateFirebaseToken = require('../middleware/authMiddleware'); // If you create a separate auth middleware file
// const authorizeAdmin = require('../middleware/adminMiddleware'); // If you create a separate admin middleware

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Admin routes (require authentication and admin role)
// For simplicity, I'm not adding the admin middleware here.
// In a real app, you'd do: router.post('/', authenticateFirebaseToken, authorizeAdmin, productController.createProduct);
router.post('/', productController.createProduct); // For testing, without admin role check
router.put('/:id', productController.updateProduct); // For testing, without admin role check
router.delete('/:id', productController.deleteProduct); // For testing, without admin role check

// router.post('/', authenticateFirebaseToken, authorizeAdmin, productController.createProduct);
//     router.put('/:id', authenticateFirebaseToken, authorizeAdmin, productController.updateProduct);
//     router.delete('/:id', authenticateFirebaseToken, authorizeAdmin, productController.deleteProduct);

module.exports = router;
// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// --- Import the new, insecure middleware ---
const verifySimpleUser = require('../middlewares/verifySimpleUser'); // Adjust path as needed

// All these routes need to be "protected" by the middleware that sets req.user.uid
// Apply verifySimpleUser to all routes that rely on req.user.uid

// @route GET /api/user/profile
router.get('/profile', verifySimpleUser, userController.getUserProfile);

// @route PUT /api/user/profile
router.put('/profile', verifySimpleUser, userController.updateUserProfile);

// @route POST /api/user/addresses
router.post('/addresses', verifySimpleUser, userController.addShippingAddress);

// @route PUT /api/user/addresses/:addressId
router.put('/addresses/:addressId', verifySimpleUser, userController.updateShippingAddress);

// @route DELETE /api/user/addresses/:addressId
router.delete('/addresses/:addressId', verifySimpleUser, userController.deleteShippingAddress);

// @route GET /api/user/wishlist
router.get('/wishlist', verifySimpleUser, userController.getWishlist);

// @route POST /api/user/wishlist/:productId
router.post('/wishlist/:productId', verifySimpleUser, userController.addToWishlist);

// @route DELETE /api/user/wishlist/:productId
router.delete('/wishlist/:productId', verifySimpleUser, userController.removeFromWishlist);

module.exports = router;
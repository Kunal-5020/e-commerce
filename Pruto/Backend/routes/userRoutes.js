// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyFirebaseToken = require('../middlewares/verifyFirebaseToken');
router.use(verifyFirebaseToken);

// All routes in userRoutes will automatically use authenticateFirebaseToken middleware
// because it's applied in server.js before passing to app.use('/api/user', ...)


router.get('/profile', userController.getUserProfile);
router.put('/profile', userController.updateUserProfile);

// Shipping Addresses
router.post('/addresses', userController.addShippingAddress);
router.put('/addresses/:addressId', userController.updateShippingAddress);
router.delete('/addresses/:addressId', userController.deleteShippingAddress);

// Wishlist
router.get('/wishlist', userController.getWishlist);
router.post('/wishlist/:productId', userController.addToWishlist);
router.delete('/wishlist/:productId', userController.removeFromWishlist);

module.exports = router;
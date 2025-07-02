const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

const verifyFirebaseToken = require('../middlewares/verifyFirebaseToken');
router.use(verifyFirebaseToken);

router.get('/', cartController.getCart);
router.post('/add', cartController.addItemToCart);
router.put('/update/:productId', cartController.updateCartItemQuantity);
router.delete('/remove/:productId', cartController.removeItemFromCart);

module.exports = router;
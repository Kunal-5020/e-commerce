const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const verifySimpleUser = require('../middlewares/verifySimpleUser');

// const verifyFirebaseToken = require('../middlewares/verifyCustomJwt');
// router.use(verifyFirebaseToken);

router.get('/', verifySimpleUser, cartController.getCart);
router.post('/add', verifySimpleUser, cartController.addItemToCart);
router.put('/update/:productId', verifySimpleUser, cartController.updateCartItemQuantity);
router.delete('/remove/:productId', verifySimpleUser, cartController.removeItemFromCart);

module.exports = router;
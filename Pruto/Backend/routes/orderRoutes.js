const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const verifySimpleUser = require('../middlewares/verifySimpleUser');

// const verifyFirebaseToken = require('../middlewares/verifyCustomJwt');
// router.use(verifyFirebaseToken);

router.post('/', verifySimpleUser, orderController.createOrder);
router.get('/', verifySimpleUser, orderController.getUserOrders);
router.get('/:id', verifySimpleUser, orderController.getOrderDetail);

module.exports = router;
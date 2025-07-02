const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

const verifyFirebaseToken = require('../middlewares/verifyFirebaseToken');
router.use(verifyFirebaseToken);

router.post('/', orderController.createOrder);
router.get('/', orderController.getUserOrders);
router.get('/:id', orderController.getOrderDetail);

module.exports = router;
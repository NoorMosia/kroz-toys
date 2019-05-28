const express = require('express');
const router = express.Router();

const isLoggedin = require('../middleware/is-loggedin');
const isNotCreator = require('../middleware/isnot-creator');
const OrderControllers = require('../controllers/order-controllers');

router.get('/orders', isLoggedin, OrderControllers.getOrders);
router.post('/orders', isLoggedin, OrderControllers.addOrder);

module.exports = router;
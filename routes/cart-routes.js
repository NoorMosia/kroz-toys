const express = require('express');
const router = express.Router();


const isLoggedin = require('../middleware/is-loggedin');
const isNotCreator = require('../middleware/isnot-creator');
const CartControllers = require('../controllers/cart-controllers')


router.get('/cart', isLoggedin, CartControllers.getCart);

router.post('/cart/:productId', isLoggedin, isNotCreator,  CartControllers.addToCart);

router.post('/cart/:productId/add', isLoggedin, CartControllers.increaseItem);

router.post('/cart/:productId/decrease', isLoggedin, CartControllers.decreaseItem);

router.post('/cart/:productId/remove', isLoggedin, CartControllers.removeItem);

module.exports = router;
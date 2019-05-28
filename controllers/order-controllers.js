const Order = require('../models/order');
const User = require('../models/user');
const Cart = require('../models/cart');
const Product = require('../models/product');

exports.addOrder = (req, res, next) => {
    const cartId = req.body.cartId;
    const user = req.session.user;
    let newOrder = new Order;

    Cart.findById(cartId)
        .then(foundCart => {
            newOrder.userId = user._id;
            newOrder.amount = foundCart.amount;

            return foundCart.populate('products.productId').execPopulate();
        })
        .then(populatedCart => {

            populatedCart.products.forEach(product => {
                newOrder.products.push({
                    name: product.productId.name,
                    price: product.productId.price,
                    creator: product.productId.user,
                    quantity: product.quantity
                })
            })

            populatedCart.products = [];
            populatedCart.amount = 0;

            newOrder.save();
            return populatedCart.save();
        })
        .then(saved => {
            res.redirect('/cart');

            return User.findById(user._id)
        })
        .then(user => {
            user.orders.push(newOrder);
            user.save();
        })
        .catch(err => {
            next(new Error(err));
        })
}

exports.getOrders = (req, res, next) => {
    user = req.session.user;

    User.findById(user._id)
        .then(foundUser => {
            return foundUser.populate('orders').execPopulate();
        })
        .then(populatedUser => {
            res.render('orders', {
                allOrders: populatedUser.orders
            })
        })
        .catch(err => {
            next(new Error(err));
        })
}
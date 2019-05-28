const Cart = require('../models/cart');
const User = require('../models/user');
const Product = require('../models/product');

exports.getCart = (req, res, next) => {
    cart = req.session.user.cart;

    Cart.findById(cart)
        .then(cart => {
                return cart.populate("products.productId").execPopulate()
        })
        .then(cart => {
            res.render('cart', {
                cart: cart
            })
        })
        .catch(err => {
            next(new Error(err));
        })
}

exports.addToCart = (req, res, next) => {
    const loggedInUser = req.session.user;
    const productId = req.params.productId;
    let productpopulated;

    Product.findById(productId)
        .then( foundProduct => {
            return foundProduct;
        })
        .then(fully => {
            productpopulated = fully;
            return Cart.findById(loggedInUser.cart)
        })
        .then(foundCart => {
            const foundIndex = foundCart.products.findIndex(cp => {
                return cp.productId.toString() === productId.toString();
            })

            if (foundIndex < 0) {
                foundCart.products.unshift({
                    productId: productId,
                    quantity: 1
                });
                foundCart.amount += productpopulated.price;
                return foundCart.save();
            } else {
                res.redirect("/cart");
            }
        })
        .then(result => {
            res.redirect("/cart");
        })
        .catch(err => {
            next(new Error(err));
        })
}

exports.increaseItem = (req, res, next) => {
    const loggedInUser = req.session.user;
    const productId = req.params.productId;
    let productpopulated;
    
    Product.findById(productId)
        .then(foundProduct => {
            productpopulated = foundProduct;
            return Cart.findById(loggedInUser.cart)
        })
        .then(foundCart => {
            const found = foundCart.products.find(cp => {
                return cp.productId.toString() === productId.toString();
            })

            if (found) {
                found.quantity++;
                foundCart.amount += productpopulated.price;

                return foundCart.save();
            }
        })
        .then(result => {
            res.redirect("/cart");
        })
        .catch(err => {
            next(new Error(err));
        })
}

exports.decreaseItem = (req, res, next) => {
    const loggedInUser = req.session.user;
    const productId = req.params.productId;
    let productpopulated;

    Product.findById(productId)
        .then(foundProduct => {
            productpopulated = foundProduct;
            return Cart.findById(loggedInUser.cart)
        })
        .then(foundCart => {
            const found = foundCart.products.find(cp => {
                return cp.productId.toString() === productId.toString();
            })

            if (found && found.quantity > 1) {
                found.quantity--;
                foundCart.amount -= productpopulated.price;

                return foundCart.save();
            }
        })
        .then(result => {
            res.redirect("/cart");
        })
        .catch(err => {
            next(new Error(err));
        })
}

exports.removeItem = (req, res, next) => {
    const loggedInUser = req.session.user;
    const productId = req.params.productId;
    let productpopulated;

    Product.findById(productId)
        .then(foundProduct => {
            productpopulated = foundProduct;
            return Cart.findById(loggedInUser.cart)
        })
        .then(foundCart => {
            const foundIndex = foundCart.products.findIndex(cp => {
                return cp.productId.toString() === productId.toString();
            })

            if (foundIndex >= 0) {
                foundCart.amount -= (productpopulated.price * foundCart.products[foundIndex].quantity);

                foundCart.products.splice(foundIndex, 1);
                return foundCart.save();
            }
        })
        .then(result => {
            res.redirect("/cart");
        })
        .catch(err => {
            next(new Error(err));
        })
}
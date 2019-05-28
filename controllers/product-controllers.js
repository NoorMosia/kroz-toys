const product   = require('../models/product');
const User      = require('../models/user');
const cart      = require('../models/cart');
const fs        = require('fs');

const ItemsPerPage = 3;

//helper functions
const fileHelpers = require('../utilities/fileHelpers');

exports.getProductList = (req, res, next) => {
    let currentPage   = +req.query.page || 1;
    let totalItems;

    //flash message handler
    let flashMessage = req.flash("success");
    let errorMessages = req.flash('error');

    //find products and render the template
    product.countDocuments()
        .then(numberOfDocs => {
            totalItems = numberOfDocs;
            return product.find()
                .skip((currentPage - 1) * ItemsPerPage)
                .limit(ItemsPerPage)
        })
        .then( result => {
        return res.render('product/products', {
                product:result,
                message: flashMessage,
                errorMessage: errorMessages,
                currentPage: currentPage,
                ItemsPerPage: ItemsPerPage,
                hasNextPage: currentPage * ItemsPerPage < totalItems,
                hasPreviousPage: currentPage > 1,
                nextPage: currentPage + 1,
                previousPage: currentPage - 1,
                lastPage: Math.ceil(totalItems / ItemsPerPage)
            });
        })
        .catch(err => {
            next(new Error(err));
        });
};

exports.getHomePage = (req, res, next) => {
    res.redirect('/products');
};

exports.getProductDetails = (req, res, next) => {
    const productId = req.params.productId;
    let newProduct;

    product.findById(productId) 
        .then(product => {
            newProduct = product;
            return User.findById(product.user);
        })
        .then(foundUser => {
            res.render('product/product-details', {
                product: newProduct,
                creator: foundUser
            });
        })
        .catch(err => {
            next(new Error(err));
        });
}

exports.getProductForm = (req, res) => {
    res.render('product/create-product');
}

exports.createProduct = (req, res, next) => {
    const name = req.body.name;
    const image = req.file;
    const price = req.body.price;
    const details = req.body.details;
    let newProduct;

    if(!image) {
        newProduct = new product({
            name: name,
            imageUrl: "images/nan.jpg",
            price: price,
            details: details,
            user: req.session.user._id
        });

        newProduct.save();
    } else {
        newProduct = new product({
            name: name,
            imageUrl: image.path,
            price: price,
            details: details,
            user: req.session.user._id
        });

        newProduct.save();
    }
    res.redirect('/user/' + req.session.user._id);

    User.findById(req.session.user._id)
        .then(user => {
            user.products.push(newProduct);
            user.save();
        })
        .catch(err => {
            next(new Error(err))
        })
};

exports.getEditProductForm = (req, res, next) => {
    const productId = req.params.productId;
    product.findById(productId)
        .then(foundProduct => {
            res.render('product/edit-product', {
                product: foundProduct
            });
        })
        .catch(err => {
            next(new Error(err));
        });
};

exports.postEditProduct = (req, res, next) => {
    const productId = req.params.productId;

    const name = req.body.name;
    const image = req.file;
    const price = req.body.price;
    const details = req.body.details;

    product.findById(productId)
        .then(product => {
            if(image) {
                if (product.imageUrl.toString() !== 'images/nan.jpg') {
                    fileHelpers.deleteFile(product.imageUrl);
                }
                product.imageUrl = image.path;
            }
            return product;
        }) 
        .then(product => {
            product.name = name;
            product.price = price;
            product.details = details;
            return product.save();
        })
        .then(result => {
            console.log('UPDATED PRODUCT!');
            res.redirect('/products/' + productId);
        })
        .catch(err => {
            next(new Error(err));
        });
};

exports.deleteProduct = (req,res, next) => {
    const productId = req.params.productId;
    let productFilled;

    product.findById(productId)
        .then(foundProduct => {
            productFilled = foundProduct;
            return User.find()
        })
        .then(allUsers => {
            allUsers.forEach(user => {
                const index = user.products.findIndex(prod => {
                    return prod.toString() === productId.toString();
                })

                if (index >= 0) {
                    if (productFilled.imageUrl.toString() !== 'images/nan.jpg')
                    {
                        fileHelpers.deleteFile(productFilled.imageUrl);
                    }
                    
                    user.products.splice(index, 1);
                    user.save()
                }

                cart.findById(user.cart)
                .then(foundCart =>{
                    const cartIndex = foundCart.products.findIndex(prod => {
                        return prod.productId.toString() === productId.toString();
                    });

                    if (cartIndex >= 0) {
                        foundCart.amount -= (productFilled.price * foundCart.products[cartIndex].quantity);
                        foundCart.products.splice(cartIndex, 1);
                        return foundCart.save()
                    }
                })
                .catch(err => {
                    next(new Error(err));
                })
            })

        })
        .then(result => {
            return product.findByIdAndDelete(productId);
        })
        .then(result => {
            req.flash('success', 'deleted ' + result.name);
            res.redirect('/user/' + req.session.user._id);
        })
        .catch(err => {
            next(new Error(err));
        })
}

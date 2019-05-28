const Product   = require('../models/product');

module.exports = (req, res, next) => {
    const productId = req.params.productId;

    Product.findById(productId)
    .then(foundProduct => {
        if (req.session.user._id.toString() !== foundProduct.user.toString()) {
            return res.redirect('back');
        }
        next();
    })
    .catch(err => {
        console.log(err);
    });
}
const express           = require('express');
const router            = express.Router();
//controllers
const productController = require('../controllers/product-controllers');
//middleware
const isLoggedin        = require('../middleware/is-loggedin');
const isCreator         = require('../middleware/is-creator')

router.get('/products', productController.getProductList);
router.get('/', productController.getHomePage);

router.get('/products/new', isLoggedin, productController.getProductForm);
router.post('/products', isLoggedin, productController.createProduct);

router.get('/products/:productId', productController.getProductDetails);

router.get('/products/:productId/edit', isLoggedin, isCreator, productController.getEditProductForm);
router.post('/products/:productId', isLoggedin, productController.postEditProduct);

router.post('/products/:productId/delete', isLoggedin, isCreator, productController.deleteProduct);

module.exports = router;
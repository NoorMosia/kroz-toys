const express   = require('express');
const router    = express.Router();

const isLoggedIn = require('../middleware/is-loggedin');

const userController = require('../controllers/user-controllers');

router.get('/users', userController.getUsers);

router.get('/user/:userId', userController.getUser);

router.get('/user/:userId/edit-pic', isLoggedIn, userController.getEditPic);
router.post('/user', userController.postEditPic);

module.exports = router;

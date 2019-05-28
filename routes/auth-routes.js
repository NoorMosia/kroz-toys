const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const { check } = require('express-validator/check');

const User = require('../models/user');
const AuthController = require('../controllers/auth-controllers')

router.get('/signup', AuthController.getSignupForm);
router.post('/signup',
    [ 
        check('name')
            .isAlphanumeric()
            .withMessage('name must be alphanumeric'),
        check('surname')
            .isAlphanumeric()
            .withMessage('surname must be alphanumeric'),
        check('email')
            .isEmail()
            .withMessage('invalid email')
            .normalizeEmail()
            .trim()
            .custom((value, { req }) => {
                return User.findOne({ email: value })
                    .then(foundUser => {
                        if (foundUser) { //if it already exists
                            return Promise.reject('E-Mail exists already, please pick a different one.');
                        }
                    });
            }),
        check('confirm-password')
            .trim()
            .custom((value, { req }) => {
                if(value !== req.body.password) {
                    return Promise.reject('passwords do not match');
                }
                return true;
            })
    ], AuthController.postSignup);

router.get('/login', AuthController.getLoginForm);
router.post('/login',
    [
        check('email')
            .trim()
            .normalizeEmail()
            .custom((value, { req }) => {
                return User.findOne({ email: value })
                    .then(foundUser => {
                        if (!foundUser) { //if it already exists
                            return Promise.reject('E-Mail address is not signed up.');
                        }
                    });
            }),
        check('password')
            .custom((value, { req }) => {
                return User.findOne({ email: req.body.email })
                    .then(foundUser => {
                        return bcrypt.compare(value, foundUser.password)
                    })
                    .then(correct => {
                        if (!correct) {
                            return Promise.reject('Invalid Password');
                        }
                    })
            })
    ], AuthController.postLogin); 
    
router.post('/logout', AuthController.logout);

module.exports = router;
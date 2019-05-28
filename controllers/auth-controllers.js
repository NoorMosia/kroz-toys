const User      = require('../models/user');
const Cart      = require('../models/cart');
const bcrypt    = require('bcryptjs');
const { validationResult } = require('express-validator/check')

//helper fuctions
const flashHelper = require('../utilities/flashHelpers');

exports.getSignupForm = (req, res) => {
    let errorMessages = req.flash('error');
    errorMessages = flashHelper.messageBuilder(errorMessages);

    res.render('auth/sign-up', {
        errorMessage: errorMessages,
        name: '',
        surname: '',
        email: ''
    });
};

exports.postSignup = (req, res, next) => {
    const name        = req.body.name;
    const surname     = req.body.surname; 
    const email       = req.body.email;
    const password    = req.body.password;
    const errors      = validationResult(req);
     
    if (errors.array().length > 0) {
        return res.status(422).render('auth/sign-up', {
            errorMessage: errors.array()[0].msg,
            name: name,
            surname: surname,
            email: email
        })
    }
    
    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const newUser       = new User;
            const cart          = new Cart;
            newUser.name        = name;
            newUser.surname     = surname;
            newUser.email       = email;
            newUser.password    = hashedPassword;
            newUser.imageUrl    = 'images/user.png';

            newUser.cart        = cart;
            
            cart.save();
            return newUser.save();
        })
        .then(results => {
            res.redirect('/')
        })
        .catch(err => {
            next(new Error(err));
        });
};

exports.getLoginForm = (req, res) => {
    let errorMessages = req.flash('error');
    errorMessages = flashHelper.messageBuilder(errorMessages);

    res.render('auth/login', {
        errorMessage: errorMessages,
        email:'',
        password:''
    });
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const errors = validationResult(req);
    let user;

    if (errors.array().length > 0) {
        return res.status(422).render('auth/login', {
            errorMessage: errors.array()[0].msg,
            email: email
        })
    }
    
    User.findOne({email:email})
        .then(foundUser => {
            user = foundUser;
            req.session.isLoggedIn = true;
            req.session.user = user;

            req.flash('success', `welcome ${user.name}`);
            res.redirect('/products');
        })
        .catch(err => {
            next(new Error(err));
        });
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        res.redirect('/');

        if (err)
            throw new Error(err);
    }) 
};
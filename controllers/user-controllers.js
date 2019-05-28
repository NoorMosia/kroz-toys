const User = require('../models/user');
const Product = require('../models/product');
const fs = require('fs');

//helper functions
const fileHelpers = require('../utilities/fileHelpers');

exports.getUsers = (req, res, next) => {
    User.find()
        .then(users => {
            res.render('user/users', {
                users:users
            });
        })
        .catch(error => {
            next(new Error(err));
        });
};


exports.getUser = (req, res, next) => {
    const userId = req.params.userId;
    let user;
    //flash message handler
    let flashMessage = req.flash("success");

    User.findById(userId)
        .then(foundUser => {
            user = foundUser;
            return user.populate('products').execPopulate();
        })
        .then(product => {
            res.render('user/user', {
                user: user,
                products: product,
                message: flashMessage
            });
        })
        .catch(error => {
            next(new Error(err));
        });
};

exports.getEditPic = (req, res) => {
    res.render('user/edit-pic');
}

exports.postEditPic = (req, res, next) => {
    const userId = req.body.userId;
    const image  = req.file;

    if(image)
    {
        User.findById(userId)
            .then(foundUser => {
                const oldUrl = foundUser.imageUrl;
                if (oldUrl.toString() !== 'images/user.png') {
                    fileHelpers.deleteFile(oldUrl);
                }

                foundUser.imageUrl = image.path;
                req.session.user = foundUser;
                return foundUser.save();
            })
            .then(result => {
                res.redirect('/user/' + userId);
            })
            .catch(err => {
                next(new Error(err));
            })
    } else {
        res.redirect('/user/' + userId);
    }
}
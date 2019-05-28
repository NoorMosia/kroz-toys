
module.exports = (req, res, next) => {
    if(!req.session.user){
        req.flash('error', 'you neeed log in first')
        return res.redirect('/login');
    }
    next();
}
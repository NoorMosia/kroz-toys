//express
const express        = require('express');
const app            = express();
const bodyParser     = require('body-parser');
//dbs
const mongoose       = require('mongoose');
//sessions
const session        = require('express-session');
const sessionStorage = require('connect-flash');
//security
const csrf           = require('csurf');
const csrfProtection = csrf();
//ux
const flash          = require('connect-flash');
//routes
const productRoutes  = require('./routes/product-routes');
const authRoutes     = require('./routes/auth-routes');
const userRoutes     = require('./routes/user-routes');
const cartRoutes     = require('./routes/cart-routes');
const orderRoutes    = require('./routes/order-routes');
//controllers
const errController  = require('./controllers/error-controllers');
//multer
const multer         = require('multer');

//playground

//helper Functions
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname + "_" + new Date().getTime() + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if( file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg') 
    {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

//setup
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/images', express.static('images'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));

app.use(session({
    secret: 'my very long secret code',
    resave: false,
    saveUninitialized: false
}));
app.use(csrfProtection);
//middleware
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.user            = req.session.user;
    res.locals.csrfToken       = req.csrfToken();
    next();
});

app.use(flash());
//use routes
app.use(productRoutes);
app.use(authRoutes); 
app.use(userRoutes);
app.use(cartRoutes);
app.use(orderRoutes);
app.use(errController.get500);
app.use(errController.get404);
  
//db and start server
mongoose.connect('mongodb://localhost/toyshops11', {useNewUrlParser: true})
.then( (result) => {
    console.log('The Database Is Up')
})
.catch( err => {
    console.log(err);
});

app.listen(3000, () => {
    console.log('SERVER STARTED!');
});
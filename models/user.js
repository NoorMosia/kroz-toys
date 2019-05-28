const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
     name: {
         type: String,
         required: true
     }, 
     surname: {
         type: String,
         required: true
     },
     email: {
         type: String,
         required: true
     },
     password: {
         type: String,
         required: true
    }, 
    imageUrl: {
        type: String,
        required: true
    },
    products: [{
         type: Schema.Types.ObjectId,
         ref: 'Product'
    }],
    orders: [{
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }],
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'Cart'
    }
});

module.exports = mongoose.model('User', userSchema);
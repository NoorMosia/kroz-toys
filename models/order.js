const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products: [{
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        creator: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    amount: {
        type: Number,
        default: 0,
        required: true
    }
},
    { timestamps: true }    
);

module.exports = mongoose.model('Order', orderSchema);
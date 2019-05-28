const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    products: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
        },
        quantity: {
            type: Number,
            default: 1,
            required: true
        }
    }],
    amount: {
        type: Number,
        default: 0,
        required: true
    }
});

module.exports = mongoose.model('Cart', cartSchema);
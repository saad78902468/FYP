const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [
        {
            product_ID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            total: {
                type: Number,
                default: 0
            }
        }
    ],
    sub_total: { type: Number, default: 0 }
});

const cartModel = mongoose.model('Cart', cartSchema);

module.exports = cartModel;

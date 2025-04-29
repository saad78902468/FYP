const Cart = require("../models/cart");
require('dotenv').config();
const Product = require("../models/products");
const mongoose = require('mongoose');

async function addProductToCart(req, res) {
    try {
        const { userId, product_id, quantity } = req.body;

        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).json({ success: false, error: "Product not found" });
        }

        const basePrice = product.price;
        if (!basePrice || basePrice <= 0) {
            return res.status(400).json({ success: false, message: "Invalid product price" });
        }

        const totalPrice = parseFloat((basePrice * quantity).toFixed(2));

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({
                userId,
                products: [
                    {
                        product_ID: product_id,
                        quantity,
                        total: totalPrice
                    }
                ],
                sub_total: totalPrice
            });
        } else {
            const existingProductIndex = cart.products.findIndex(p => p.product_ID.toString() === product_id);

            if (existingProductIndex !== -1) {
                const existingProduct = cart.products[existingProductIndex];
                existingProduct.quantity += quantity;
                existingProduct.total = parseFloat((existingProduct.quantity * basePrice).toFixed(2));
            } else {
                cart.products.push({
                    product_ID: product_id,
                    quantity,
                    total: totalPrice
                });
            }

            cart.sub_total = cart.products.reduce((acc, p) => acc + p.total, 0);
            cart.sub_total = parseFloat(cart.sub_total.toFixed(2));
        }

        await cart.save();
        return res.status(200).json({ success: true, data: cart });

    } catch (err) {
        console.error("Error:", err.message);
        return res.status(500).json({ success: false, error: err.message });
    }
}


async function getCart(req, res) {
    try {
        const { userId } = req.params;

        const cart = await Cart.findOne({ userId }).populate({
            path: 'products.product_ID',
            model: 'Product',
            select: 'name shortDescription category price'
        });

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found for the specified userId' });
        }

        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


async function removeFromCart(req, res) {
    const { userId, product_id } = req.params;

    try {
        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const productIndex = cart.products.findIndex(item => item.product_ID.toString() === product_id);
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }

        const removedTotal = cart.products[productIndex].total;
        cart.products.splice(productIndex, 1);
        cart.sub_total = Math.max(0, cart.sub_total - removedTotal);

        const updatedCart = await cart.save();
        res.status(200).json(updatedCart);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    addProductToCart,
    getCart,
    removeFromCart,
};

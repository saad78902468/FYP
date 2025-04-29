const AddressModel = require('../models/address');
const OrderModel = require('../models/orders');
const ProductModel = require('../models/products');
const Cart = require("../models/cart");

require('dotenv').config();
const { validationResult } = require("express-validator");
var mongoose = require('mongoose');

const createOrder = async (req, res) => {
    const { user_id, address_id, products } = req.body;
console.log(req.body)
    try {
        const newOrder = new OrderModel({
            user_id,
            address_id,
            products
        });

        const savedOrder = await newOrder.save();

        await Cart.deleteOne({ userId: user_id });
        res.status(201).json(savedOrder);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getOrder = async (req, res) => {
    const order_id = req.params.order_id;

    try {
        const order = await OrderModel.findOne({ _id: order_id })
            .populate({
                path: 'products.product_ID',
                model: 'Products',
                select: 'name price description'
            })
            .populate({
                path: 'address_id',
                model: 'Address',
                select: 'user_id house_no street city postcode instructions appartment_name floor building_name entry_code business_name hotel_name business'
            });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getOrdersList = async (req, res) => {
    try {
        const orders = await OrderModel.find()
            .populate({
                path: 'products.product_ID',
                model: 'Product',
                select: 'name price description'
            })
            .populate({
                path: 'address_id',
                model: 'Address',
                select: 'user_id house_no street city postcode instructions appartment_name floor building_name entry_code business_name hotel_name business address_type'
            });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ error: 'No orders found' });
        }

        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

async function deleteOrder(req, res) {
    const { id } = req.params;

    try {
        const deletedCategory = await OrderModel.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createOrder,
    getOrder,
    getOrdersList,
    deleteOrder
};
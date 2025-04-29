const express = require('express');
const cartController = require('../controllers/cartController');
const router = express.Router();



router.post('/add-Prouct-to-cart', cartController.addProductToCart);
router.get('/get-cart/:userId', cartController.getCart);
// router.delete('/remove-product-from-cart/:product_id', cartController.removeFromCart);
router.delete('/remove-product-from-cart/:guestId/:product_id', cartController.removeFromCart);

module.exports = router;

const express = require('express');
const {
    createCart,
    addItemToCart,
    viewCart,
    deleteCart,
    updateCartItem,
    removeItem,
    removeAllItems,
    updateStock,
    checkOut,
} = require('../controllers/cartController');

const authenticateJWT = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/roleMiddleware');

const router = express.Router();



router.post('/create', authenticateJWT, authorizeRole(['buyer']), createCart);  // Create new cart
router.post("/addItem", authenticateJWT, addItemToCart);  // Add Item to cart
router.get('/:id', authenticateJWT, authorizeRole(['buyer', 'admin']), viewCart);    // View cart with items
router.delete('/:id', authenticateJWT, authorizeRole(['buyer', 'admin']), deleteCart); // Delete a cart
router.put('/updateCart/:id', authenticateJWT, authorizeRole(['buyer']), updateCartItem);
router.delete('/removeItem/:id', authenticateJWT, authorizeRole(['buyer']), removeItem);
router.delete('/clear', authenticateJWT, authorizeRole(['buyer']), removeAllItems);
router.post('/checkout', authenticateJWT, authorizeRole(['buyer']), checkOut);
module.exports = router;
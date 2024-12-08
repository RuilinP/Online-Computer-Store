const express = require('express');
const {
    createCart,
    addItemToCart,
    viewCart,
    deleteCart,
    updateCart,
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
router.get('/view', authenticateJWT, authorizeRole(['buyer', 'admin']), viewCart);    // View cart with items
router.delete("/delete", authenticateJWT, deleteCart); // Delete a cart
router.put("/update", authenticateJWT, updateCart);
router.post("/removeItem", authenticateJWT, removeItem);
router.delete('/clear', authenticateJWT, authorizeRole(['buyer']), removeAllItems);
router.post('/checkout', authenticateJWT, authorizeRole(['buyer']), checkOut);
module.exports = router;
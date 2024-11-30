const express = require('express');
const {
    createCart,
    addItemToCart,
    getCart,
    deleteCart,
} = require('../controllers/cartController');

const authenticateJWT = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/roleMiddleware');

const router = express.Router();



router.post('/create', authenticateJWT, authorizeRole(['buyer']), createCart);  // Create new cart
router.post('/add', authenticateJWT, authorizeRole(['buyer']), addItemToCart);  // Add Item to cart
router.get('/:id', authenticateJWT, authorizeRole(['buyer', 'admin']), getCart);    // Get cart with items
router.delete('/:id', authenticateJWT, authorizeRole(['buyer', 'admin']), deleteCart); // Delete a cart


module.exports = router;
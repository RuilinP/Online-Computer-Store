const express = require('express');
const {
    createOrder,
    addItemToOrder,
    getOrder,
    deleteOrder,
    getAllOrders,
    updateOrder,
} = require('../controllers/orderController');

const authenticateJWT = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/roleMiddleware');

const router = express.Router();

router.post('/create', authenticateJWT, authorizeRole(['buyer']), createOrder);  // Create new order
router.post('/add', authenticateJWT, authorizeRole(['buyer']), addItemToOrder);  // Add Item to order
router.get('/:id', authenticateJWT, authorizeRole(['buyer', 'admin']), getOrder);    // Get order with items
router.delete('/:id', authenticateJWT, authorizeRole(['admin']), deleteOrder); // Delete an order
router.get('/', authenticateJWT, authorizeRole(['admin']), getAllOrders); // Get all orders for admin
router.put('/:id', authenticateJWT, authorizeRole(['admin']), updateOrder); // Update any order by ID


module.exports = router;
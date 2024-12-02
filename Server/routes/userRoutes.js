const express = require('express');
const {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    loginUser,
} = require('../controllers/userController');

const authenticateJWT = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/roleMiddleware');

const router = express.Router();


router.post('/register', createUser); // Create a new user (public route)
router.post('/login', loginUser);
router.get('/', authenticateJWT, authorizeRole(['admin', 'seller']), getUsers);  // Get all users (admin only)
router.get('/:id', authenticateJWT, authorizeRole(['admin', 'seller']), getUserById);        // Get a user by ID
router.put('/:id', authenticateJWT, updateUser);         // Update user details
router.delete('/:id', authenticateJWT, authorizeRole(['admin']), deleteUser); // Delete a user (admin only)


module.exports = router;
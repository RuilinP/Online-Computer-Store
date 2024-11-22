const express = require('express');
const {
    createUser,
    getUserById,
    loginUser,
    getUsers,
    updateUser,
    deleteUser,

} = require('../controllers/userController');

const authenticateJWT = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/roleMiddleware');

const router = express.Router();


router.post('/register', createUser); // Create a new user
router.get('/:id', authenticateJWT, getUserById);  // Get a user by ID
router.post('/login', loginUser); //Login 
router.get('/', authenticateJWT, authorizeRole('admin'), getUsers);  // Get all users (admin only)
router.put('/:id', authenticateJWT, updateUser);   // Update user details
router.delete('/:id', authenticateJWT, authorizeRole('admin'), deleteUser); // Delete a user (admin only)


module.exports = router;
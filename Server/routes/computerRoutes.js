const express = require('express');
const { getComputerByIndex, addNewComputer } = require('../controllers/computerController');
const authenticateJWT = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/roleMiddleware');

const router = express.Router();
router.get('/:id', getComputerByIndex);
router.post('/', authenticateJWT, authorizeRole('admin'), addNewComputer); 

module.exports = router;
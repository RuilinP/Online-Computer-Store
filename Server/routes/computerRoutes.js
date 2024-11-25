const express = require('express');
const { getComputerByIndex, addNewComputer, updateComputer, deleteComputer } = require('../controllers/computerController');
const authenticateJWT = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();
router.get('/:id', getComputerByIndex);
router.post('/', authenticateJWT, authorizeRole('admin'), upload.array('images', 10),addNewComputer); 
router.put('/:id', authenticateJWT, authorizeRole('admin'), upload.array('images', 10),updateComputer);
router.delete('/:id', authenticateJWT, authorizeRole('admin'), deleteComputer); 

module.exports = router;
const express = require('express');
const { getComputerByIndex, addNewComputer, updateComputer, deleteComputer } = require('../controllers/computerController');
const authenticateJWT = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();
router.get('/:id', getComputerByIndex);
router.post('/', authenticateJWT, authorizeRole('admin'), upload.single('image'),addNewComputer); 
router.put('/:id', authenticateJWT, authorizeRole('admin'), updateComputer);
router.delete('/:id', authenticateJWT, authorizeRole('admin'), deleteComputer); 

module.exports = router;
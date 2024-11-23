const express = require('express');
const { getComputerByIndex } = require('../controllers/computerController');

const router = express.Router();
router.get('/:id', getComputerByIndex);

module.exports = router;
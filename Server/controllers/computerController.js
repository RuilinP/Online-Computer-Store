const Computer = require('../models/Computer');

exports.getComputerByIndex = async (req, res) => {
    try {
        const { id } = req.params; 
        const computer = await Computer.findOne({ where: { computer_id: id } });  

        if (!computer) {
            return res.status(404).json({ message: `Computer with ID ${id} not found` });
        }

        res.status(200).json({ message: 'Computer retrieved successfully', computer });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving computer', error: error.message });
    }
};
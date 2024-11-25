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

exports.addNewComputer = async (req, res) => {
    try {
        const { model, name, category, address, specification, manufacturer, releaseDate, stockCode, popularity } = req.body;

        if (!model || !name || !category || !stockCode) {
            return res.status(400).json({ message: 'Model, name, category, and stockCode are required.' });
        }

        const existingComputer = await Computer.findOne({
            where: { stockCode },
        });
        if (existingComputer) {
            return res.status(409).json({ message: `A computer with stockCode ${stockCode} already exists.` });
        }

        const newComputer = await Computer.create({
            model,
            name,
            category,
            address,
            specification,
            manufacturer,
            releaseDate,
            stockCode,
            popularity,
        });

        res.status(201).json({ message: 'New computer added successfully.', computer: newComputer });
    } catch (err) {
        res.status(500).json({ message: 'Error adding new computer.', error: err.message });
    }
};


exports.updateComputer = async (req, res) => {
    try {
        const { id } = req.params; 
        const updateData = req.body; 

        const computer = await Computer.findOne({ where: { computer_id: id } });
        if (!computer) {
            return res.status(404).json({ message: `Computer with ID ${id} not found.` });
        }

        await computer.update(updateData);

        res.status(200).json({
            message: 'Computer updated successfully.',
            computer,
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error updating computer.',
            error: err.message,
        });
    }
};

exports.deleteComputer = async (req, res) => {
    try {
        const { id } = req.params;

        const computer = await Computer.findOne({ where: { computer_id: id } });
        if (!computer) {
            return res.status(404).json({ message: `Computer with ID ${id} not found.` });
        }

        await computer.destroy();

        res.status(200).json({ message: `Computer with ID ${id} deleted successfully.` });
    } catch (err) {
        res.status(500).json({
            message: 'Error deleting computer.',
            error: err.message,
        });
    }
};
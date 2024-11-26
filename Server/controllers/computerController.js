const Computer = require('../models/Computer');
const Image = require('../models/Image'); 

exports.getComputerByIndex = async (req, res) => {
    try {
        const { id } = req.params; 

        const computer = await Computer.findOne({
            where: { computer_id: id },
            include: { model: Image, as: 'images' }, 
        });

        if (!computer) {
            return res.status(404).json({ message: `Computer with ID ${id} not found.` });
        }

        res.status(200).json({ message: 'Computer retrieved successfully.', computer });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching computer.', error: err.message });
    }
};

exports.addNewComputer = async (req, res) => {
    const transaction = await Computer.sequelize.transaction();
    try {
        const { model, name, category, address, specification, manufacturer, releaseDate, stockCode, popularity, price } = req.body;

        if (!model || !name || !category || !stockCode) {
            return res.status(400).json({ message: 'Model, name, category, and stockCode are required.' });
        }

        if (!price || isNaN(price) || price < 0) {
            return res.status(400).json({ message: 'Invalid price. Price must be a non-negative number.' });
        }

        const existingComputer = await Computer.findOne({ where: { stockCode } });
        if (existingComputer) {
            return res.status(409).json({ message: `A computer with stockCode ${stockCode} already exists.` });
        }

        const newComputer = await Computer.create(
            {
                model,
                name,
                category,
                address,
                specification,
                manufacturer,
                releaseDate,
                stockCode,
                popularity,
                price,
            },
            { transaction }
        );

        

        if (req.files && req.files.length > 0) {
            const imageRecords = req.files.map((file) => ({
                computer_id: newComputer.computer_id,
                image_path: `/uploads/${file.filename}`,
            }));
            await Image.bulkCreate(imageRecords, { transaction });
        }

        await transaction.commit();
        const images = await Image.findAll({ where: { computer_id: newComputer.computer_id } });
        res.status(201).json({ message: 'New computer added successfully.', computer: newComputer, images });

    } catch (err) {
        await transaction.rollback();
        res.status(500).json({ message: 'Error adding new computer.', error: err.message });
    }
};


exports.updateComputer = async (req, res) => {
    const transaction = await Computer.sequelize.transaction();
    try {
        const { id } = req.params; 
        const { removeImages = [] } = req.body;
        const updateData = { ...req.body }; 

        const computer = await Computer.findOne({ where: { computer_id: id } });
        if (!computer) {
            return res.status(404).json({ message: `Computer with ID ${id} not found.` });
        }

        if (updateData.price && (isNaN(updateData.price) || updateData.price < 0)) {
            return res.status(400).json({ message: 'Invalid price. Price must be a non-negative number.' });
        }
        

        delete updateData.removeImages; 
        await computer.update(updateData, { transaction });

        if (Array.isArray(removeImages) && removeImages.length > 0) {
            await Image.destroy({
                where: {
                    image_id: removeImages,
                    computer_id: id,
                },
                transaction,
            });
        }

        if (req.files && req.files.length > 0) {
            const newImages = req.files.map((file) => ({
                computer_id: id,
                image_path: `/uploads/${file.filename}`,
            }));
            await Image.bulkCreate(newImages, { transaction });
        }

        await transaction.commit();

        const updatedComputer = await Computer.findOne({
            where: { computer_id: id },
            include: { model: Image, as: 'images' }, 
        });

        res.status(200).json({
            message: 'Computer updated successfully.',
            computer: updatedComputer,
        });
    } catch (err) {
        await transaction.rollback();
        res.status(500).json({ message: 'Error updating computer.', error: err.message });
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
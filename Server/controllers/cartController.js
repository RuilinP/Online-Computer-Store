const Computer = require('../models/Computer');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const sequelize = require('../config/db');


//Create a cart
exports.createCart = async (req, res, next) => {
    try {
        const { user_id } = req.body;
        const cart = await Cart.create({ user_id });
        res.status(201).json({ message: 'Cart created Successfully.', cart });
    } catch (error) {
        next(error); //pass error to error handler in app.js
    }
};

// Add an item to the cart
exports.addItemToCart = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const { cart_id, computer_id, quantity } = req.body;

        // Validate item exist
        const existingItem = await Computer.findByPk(computer_id);
        if (!existingItem) {
            throw new Error(`Computer with ID ${computer_id} not found`);
        }

        const newItem = await CartItem.create({ cart_id, computer_id, quantity }, { transaction });
        await transaction.commit();
        res.status(201).json({ message: 'Item added succsefully', newItem });
    } catch (error) {
        await transaction.rollback();
        next(error); //pass error to error handler in app.js
    }
};

// Get cart with items
exports.getCart = async (req, res, next) => {
    try {
        const { id } = req.params;
        const cart = await Cart.findOne({
            where: { cart_id: id },
            include: [
                {
                    model: CartItem,
                    as: 'items',
                    include: [
                        {
                            model: Computer,
                            as: 'computer',
                            attributes: ['computer_id', 'model', 'name'], // limit 
                        }],
                }],
        });

        if (!cart) {
            return res.status(404).json({ message: `Cart with Id ${id} not found` });
        }

        res.status(200).json({ cart });
    } catch (error) {
        next(error); //pass error to error handler in app.js
    }
};

// Delete a cart
exports.deleteCart = async (req, res, next) => {
    try {
        const { id } = req.params;
        const cart = await Cart.findOne({ where: { cart_id: id } });

        if (!cart) {
            return res.status(404).json({ message: `Cart with Id ${id} not found.` });
        }

        await cart.destroy();

        res.status(200).json({ message: `Cart with ID ${id} deleted successfully.` });
    } catch (error) {
        next(error); //pass error to error handler in app.js
    }
};
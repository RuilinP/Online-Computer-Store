const sequelize = require('../config/db');
const Computer = require('../models/Computer');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const OrderItem = require('../models/OrderItem');
const Order = require('../models/Order');


// -----* Create a cart *-----
exports.createCart = async (req, res, next) => {

    try {
        const user_id = req.user.id; //user id instance
        const cart = await Cart.create({ user_id });

        res.status(201).json({ message: 'Cart created Successfully.', cart });
    } catch (error) {
        next(error); //pass error to error handler in app.js
    }
};

// -----* Add an item to cart *-----
exports.addItemToCart = async (req, res, next) => {
    const { computer_id, quantity } = req.body;

    const transaction = await sequelize.transaction();
    try {
        // Find or create a cart for the authenticated user
        let cart = await Cart.findOne({ where: { user_id: req.user.id } });
        if (!cart) {
            cart = await Cart.create({ user_id: req.user.id }, { transaction });
        }

        // Ensure the computer exists and has sufficient stock
        const computer = await Computer.findByPk(computer_id, { transaction });
        if (!computer) {
            return res.status(404).json({ message: `Computer with ID ${computer_id} not found.` });
        }
        if (computer.stock < quantity) {
            return res.status(400).json({
                message: `Insufficient stock. Available stock: ${computer.stock}.`,
            });
        }

        // Check if the item already exists in the cart
        const existingItem = await CartItem.findOne({ where: { cart_id: cart.cart_id, computer_id }, transaction });
        if (existingItem) {
            const updatedQuantity = Number(existingItem.quantity) + Number(quantity);
            if (updatedQuantity > computer.stock) {
                return res.status(400).json({
                    message: `Cannot add ${quantity} items. Available stock: ${computer.stock - existingItem.quantity}.`,
                });
            }
            await existingItem.update({ quantity: updatedQuantity }, { transaction });
        } else {
            // Add the item to the cart if it doesn't exist
            await CartItem.create({ cart_id: cart.cart_id, computer_id, quantity }, { transaction });
        }

        await transaction.commit();
        res.status(201).json({ message: "Item added to cart successfully." });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};




// -----* View cart with items *-----
exports.viewCart = async (req, res, next) => {
    try {
        // Fetch the cart using the authenticated user's ID
        const cart = await Cart.findOne({
            where: { user_id: req.user.id },
            include: [
                {
                    model: CartItem,
                    as: 'items',
                    include: [
                        {
                            model: Computer,
                            as: 'computer',
                            attributes: ['computer_id', 'model', 'name', 'price'], // Limit returned fields
                        }
                    ],
                }
            ],
        });

        if (!cart) {
            return res.status(404).json({ message: `Cart not found for user.` });
        }

        let subtotal = 0;
        cart.items.forEach((item) => {
            if (item.computer) {
                subtotal += item.quantity * item.computer.price;
            }
        });

        const saleTaxRate = 0.13;
        const tax = subtotal * saleTaxRate;
        const shippingFees = 10;
        const total = subtotal + tax + shippingFees;

        res.json({
            items: cart.items.map((item) => ({
                id: item.id,
                computer_id: item.computer_id,
                name: item.computer.name,
                price: item.computer.price,
                quantity: item.quantity,
                subtotal: item.quantity * item.computer.price,
            })),
            subtotal,
            tax,
            shippingFees,
            total,
        });
    } catch (error) {
        next(error); // Pass error to error handler
    }
};


// -----* Delete a cart *-----
exports.deleteCart = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        // Find the cart for the authenticated user
        const cart = await Cart.findOne({ where: { user_id: req.user.id } });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found for user." });
        }

        // Delete all items and the cart itself
        await CartItem.destroy({ where: { cart_id: cart.cart_id }, transaction });
        await cart.destroy({ transaction });

        await transaction.commit();
        res.status(200).json({ message: "Cart deleted successfully." });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};


// -----* Update cart items *-----
exports.updateCart = async (req, res, next) => {
    const { items } = req.body; // Expecting an array of { computer_id, quantity }
    const transaction = await sequelize.transaction();

    try {
        // Find the cart for the authenticated user
        const cart = await Cart.findOne({ where: { user_id: req.user.id } });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found for user." });
        }

        for (const item of items) {
            const { computer_id, quantity } = item;

            // Check stock availability
            const computer = await Computer.findByPk(computer_id, { transaction });
            if (!computer || computer.stock < quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for computer ID ${computer_id}.`,
                });
            }

            // Update the cart item or create a new one
            const cartItem = await CartItem.findOne({ where: { cart_id: cart.cart_id, computer_id }, transaction });
            if (cartItem) {
                await cartItem.update({ quantity }, { transaction });
            } else {
                await CartItem.create({ cart_id: cart.cart_id, computer_id, quantity }, { transaction });
            }
        }

        await transaction.commit();
        res.status(200).json({ message: "Cart updated successfully." });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};


// -----*remove item from cart *-----
exports.removeItem = async (req, res, next) => {
    const { computer_id } = req.body;

    const transaction = await sequelize.transaction();
    try {
        // Find the cart for the authenticated user
        const cart = await Cart.findOne({ where: { user_id: req.user.id } });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found for user." });
        }

        // Remove the item from the cart
        const cartItem = await CartItem.findOne({ where: { cart_id: cart.cart_id, computer_id }, transaction });
        if (!cartItem) {
            return res.status(404).json({ message: `Item with computer ID ${computer_id} not found in cart.` });
        }

        await cartItem.destroy({ transaction });
        await transaction.commit();

        res.status(200).json({ message: "Item removed from cart successfully." });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};


// -----*remove all items from cart *-----
exports.removeAllItems = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const { cart_id } = req.body;
        console.log('Cart ID: ', req.body);
        if (!cart_id) {
            return res.status(404).json({ message: `cart id is required.` });

        }
        const cart = await Cart.findOne({ where: { cart_id }, transaction });
        if (!cart) {
            return res.status(404).json({ message: `cart not found.` });
        }
        const items = await CartItem.findAll({ where: { cart_id }, transaction });
        if (!items || items.lenght === 0) {
            return res.status(404).json({ message: `Cart is empty.` });
        }

        await CartItem.destroy({ where: { cart_id }, transaction });

        await transaction.commit();

        res.status(200).json({ message: `CartItems removed successfully.` })
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

// -----* Update stock *-----
exports.updateStock = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { cart_id } = req.user;
        const cartItems = await CartItem.destroy({ where: { cart_id }, transaction });
        for (const item of cartItems) {
            const computer = await Computer.findByPk(item.computer_id);

            if (!computer.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${computer.name}`, });
            }
            computer.stock -= item.quantity;
            await computer.save({ transaction });
        }

        await transaction.commit();
        res.status(200).json({ message: `CartItems removed successfully.` })
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

// -----* Checkout *-----
exports.checkOut = async (req, res, next) => {
    console.log("Check the method checkout");
    const transaction = await sequelize.transaction();
    try {
        const cart = await Cart.findOne({
            where: { user_id: req.user.id },
            include: {
                model: CartItem,
                as: "items",
                include: [{ model: Computer, as: 'computer' }]
            },
            transaction,
        });

        if (!cart || cart.items.length === 0) {
            await transaction.rollback();
            return res.status(400).json({ error: "The Cart is Empty" });
        }

        const subtotal = cart.items.reduce((acc, item) => acc + (item.computer.price * item.quantity), 0);
        const saleTaxRate = 0.13; // Example tax rate
        const tax = parseFloat((subtotal * saleTaxRate).toFixed(2)); // Fix: Proper tax calculation
        const shippingFees = 10; // Example flat shipping fee
        const total = parseFloat((subtotal + tax + shippingFees).toFixed(2)); // Fix: Proper total calculation

        for (const item of cart.items) {
            if (item.computer.stock < item.quantity) {
                await transaction.rollback();
                return res.status(400).json({ error: 'Insufficient quantity for this product' });
            }
            item.computer.stock -= item.quantity;
            await item.computer.save({ transaction });
        }

        const order = await Order.create({
            user_id: req.user.id,
            total_price: total,
            status: "pending",
        }, { transaction });

        const orderItems = cart.items.map((item) => ({
            order_id: order.order_id,
            computer_id: item.computer_id,
            name: item.computer.name,
            price: item.computer.price,
            quantity: item.quantity,
        }));

        await OrderItem.bulkCreate(orderItems, { transaction });

        await CartItem.destroy({ where: { cart_id: cart.cart_id }, transaction });
        await transaction.commit();
        res.status(200).json({ message: `Checkout successfully.`, order });
    } catch (error) {
        await transaction.rollback();
        console.error("Error during checkout:", error);
        next(error);
    }
};


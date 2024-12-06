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
    // fetching information from the request body
    const { cart_id, computer_id, quantity } = req.body;
    // Implement transaction for data integrity: all succeed or rollback
    const transaction = await sequelize.transaction();
    try {
        const computer = await Computer.findByPk(computer_id, { transaction });
        if (!computer || computer.stock < quantity) {
            return res.status(400).json({ message: `Computer with Id ${computer_id} is out of stock` });
        }

        const existingItem = await CartItem.findOne({ where: { cart_id, computer_id }, transaction });
        // Validate item existing in the cartItem
        if (existingItem) {
            const quantityUpdated = Number(existingItem.quantity) + Number(quantity);
            //update the quantity in the cartItem
            await existingItem.update({ quantity: quantityUpdated }, { transaction });
        } else {
            // if the item do not exist in the cartItem, add item to the cart
            await CartItem.create({ cart_id, computer_id, quantity }, { transaction });
        }

        await transaction.commit(); //commit changes
        const cartItemUpdates = await CartItem.findAll({ where: { cart_id }, });
        res.status(201).json({ message: 'Item added succsefully', cartItemUpdates });
    } catch (error) {
        await transaction.rollback(); // do not make changes to db if there is an error
        next(error); //pass error to error handler in app.js
    }
};


// -----* View cart with items *-----
exports.viewCart = async (req, res, next) => {
    try {
        const { id } = req.params; // Extracting id from route parametrs in the URL path
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
                            attributes: ['computer_id', 'model', 'name', 'price'], // limit the returned computers 
                        }],
                }],
        });

        if (!cart) {
            return res.status(404).json({ message: `Cart with Id ${id} not found` });
        }

        let subtotal = 0;
        cart.items.forEach(item => {
            if (item.computer) {
                subtotal += item.quantity * item.computer.price;
            }
        });

        const saleTaxRate = 0.13;
        const tax = subtotal * saleTaxRate;
        const shippingFees = 10;
        const total = subtotal + tax + shippingFees;


        res.json({
            items: cart.items.map(item => ({
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
        next(error); //pass error to error handler in app.js
    }
};

// -----* Delete a cart *-----
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

// -----* Update cart items *-----
exports.updateCartItem = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { computer_id, quantity } = req.body;
        const item = await CartItem.findByPk(id);

        if (!item) {
            return res.status(404).json({ message: `Item with Id ${id} not found.` });
        }
        const computer = await Computer.findByPk(item.computer_id);
        if (!computer || computer.stock < quantity) {
            return res.status(400).json({ message: `Computer with Id ${computer_id} is out of stock` });
        }


        item.quantity = quantity;

        await item.save({ transaction });
        await transaction.commit();
        res.status(200).json({ message: `CartItem with ID ${id} updated successfully.` })
    } catch (error) {
        await transaction.rollback();
        next(error); //pass error to error handler in app.js
    }
};

// -----*remove item from cart *-----
exports.removeItem = async (req, res, next) => {
    try {
        const { id } = req.params; //extract user id for the url
        const item = await CartItem.findByPk(id);
        if (!item) {
            return res.status(404).json({ message: `Item with Id ${id} not found.` });
        }

        await item.destroy();

        res.status(200).json({ message: `Item with ID ${id} removed from the cart successfully.` })
    } catch (error) {

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
                model: CartItem, as: "items", include: [{ model: Computer, as: 'computer' }]
            },
            transaction,
        });

        if (!cart || cart.items.length === 0) {
            await transaction.rollback();
            return res.status(400).json({ erro: "The Cart is Empty" });
        }

        const subtotal = cart.items.reduce((acc, item) => acc + (item.computer.price * item.quantity), 0);
        const saleTaxRate = 0.13;
        const tax = (subtotal * saleTaxRate).DECIMAL(10, 1);
        const shippingFees = 10;
        const total = subtotal + tax + shippingFees;

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
        },
            { transaction }
        );

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
        res.status(200).json({ message: `Checkout successfully.`, order })
    } catch (error) {
        await transaction.rollback();
        console.error("Error during checkout:", error);
        next(error);
    }
};
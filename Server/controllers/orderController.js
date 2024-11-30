const Computer = require('../models/Computer');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');


//Create a order
exports.createOrder = async (req, res) => {
    try {
        const { user_id, total_price, order_status } = req.body;
        const order = await Order.create({ user_id, total_price, order_status });
        res.status(201).json({ message: 'Order created Successfully.', order });
    } catch (error) {
        res.status(500).json({ message: 'Error creating order.', error: error.message });
    }
};

// Add an item to the order
exports.addItemToOrder = async (req, res) => {
    try {
        const { order_id, computer_id, price, quantity } = req.body;
        const orderItem = await OrderItem.create({ order_id, computer_id, price, quantity });
        res.status(201).json({ message: 'Item added succsefully', orderItem });
    } catch (error) {
        res.status(500).json({ message: 'Error adding Item to order', error: error.message });
    }
};

// Get order with items
exports.getOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findOne({
            where: { order_id: id },
            include: [
                {
                    model: OrderItem,
                    as: 'items',
                    include: [
                        {
                            model: Computer,
                            as: 'computer'
                        }],
                }],
        });

        if (!order) {
            return res.status(404).json({ message: `Order with Id ${id} not found` });
        }

        res.status(200).json({ order });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error: error.message });
    }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findOne({ where: { order_id: id } });

        if (!order) {
            return res.status(404).json({ message: `Order with Id ${id} not found.` });
        }

        await order.destroy();

        res.status(200).json({ message: `Order with ID ${id} deleted successfully.` });
    } catch (error) {
        res.status(500).json({ message: `Error deleting Order.`, error: error.message });
    }
};
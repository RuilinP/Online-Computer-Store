const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); //Import database connection
const Order = require('./Order');
const Computer = require('./Computer');

class OrderItem extends Model { }

OrderItem.init(
    {
        order_item_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        // Create foreign keys:
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Order,
                key: 'order_id',
            },
        },
        computer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Computer,
                key: 'computer_id',
            },
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },

        quantity: { //Pendding, completed or canceled
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'OrderItem',
        tableName: 'order_items',
        timestamps: true,
    }
);


//Relationship between OrderItem: Computer and Order
Order.hasMany(OrderItem, {
    foreignKey: 'order_id',
    as: 'items'
});

OrderItem.belongsTo(Order, {
    foreignKey: 'order_id',
    as: 'order'
});
Computer.hasMany(OrderItem, {
    foreignKey: 'computer_id',
    as: 'orderItems'
});

OrderItem.belongsTo(Computer, {
    foreignKey: 'computer_id',
    as: 'computer'
});

module.exports = OrderItem;